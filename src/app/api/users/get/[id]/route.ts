import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. AUTH & RBAC Check: Admin Only
    const session = await verifySession("ADMIN");
    if (session instanceof NextResponse) return session;

    const { id } = params;
    const userId = Number(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nama: true,
        usernamegithub: true,
        email: true,
        position: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format roles for easier consumption
    const formattedUser = {
      ...user,
      roles: user.roles.map((r) => r.role.name),
    };

    return NextResponse.json(
      { user: formattedUser, status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
