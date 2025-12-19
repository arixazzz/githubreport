import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // 1. AUTH & RBAC Check: Admin Only
    const session = await verifySession("ADMIN");
    if (session instanceof NextResponse) return session;

    // 2. Fetch all users with their roles
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Format users data for easier consumption in frontend
    const formattedUsers = users.map((user) => ({
      id: user.id,
      nama: user.nama,
      usernamegithub: user.usernamegithub,
      email: user.email,
      position: user.position,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      // Format roles as array of role names
      roles: user.roles.map((r) => r.role.name),
      // For backward compatibility, also provide first role as 'role'
      role: user.roles.length > 0 ? user.roles[0].role.name : null,
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
