import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // 1. AUTH Verification
    const session = await verifySession();
    if (session instanceof NextResponse) return session;

    const { payload } = session;

    // 2. Ambil user dari DB
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

    // 3. Normalisasi roles & permissions
    const roles = user.roles.map((r) => r.role.name);

    const permissions = Array.from(
      new Set(
        user.roles.flatMap((r) =>
          r.role.permissions.map((p) => p.permission.name)
        )
      )
    );

    // 4. Response (Safe: no hash/password)
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
    console.error("auth/me error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
