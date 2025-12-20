import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // 1. AUTH & SESSION
    const session = await verifySession();
    if (session instanceof NextResponse) return session;

    const { payload } = session;

    console.log(
      "🔍 [API user/detail] Debug: Request authorized for UID:",
      payload.sub
    );

    // 2. AMBIL USER DARI DB
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. NORMALISASI ROLES & PERMISSIONS
    const roles = user.roles.map((r) => r.role.name);
    const permissions = Array.from(
      new Set(
        user.roles.flatMap((r) =>
          r.role.permissions.map((p) => p.permission.name)
        )
      )
    );

    // 4. RESPONSE (No password hash)
    return NextResponse.json(
      {
        id: user.id,
        nama: user.nama,
        usernamegithub: user.usernamegithub,
        email: user.email,
        position: user.position,
        roles,
        permissions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("user/detail error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
