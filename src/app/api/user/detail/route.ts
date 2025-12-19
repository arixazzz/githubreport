import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

interface AccessTokenPayload {
  sub: number;
  roles: string[];
  permissions: string[];
}

function isAccessTokenPayload(payload: unknown): payload is AccessTokenPayload {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "sub" in payload &&
    "roles" in payload &&
    "permissions" in payload
  );
}

export async function GET(req: NextRequest) {
  try {
    // ===============================
    // ===============================
    // 1. Ambil token
    // ===============================
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    console.log("🔍 [API user/detail] Debug: Request received");
    console.log(" - Cookie 'accessToken':", token ? "Present" : "Missing");
    if (!token)
      console.log(
        " - All Cookies:",
        cookieStore
          .getAll()
          .map((c) => c.name)
          .join(", ")
      );

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ===============================
    // 2. Decode & validasi JWT
    // ===============================
    const decodedRaw = jwt.verify(token, process.env.NEXTAUTH_SECRET || "");

    if (!isAccessTokenPayload(decodedRaw)) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    // ===============================
    // 3. Ambil user dari DB
    // ===============================
    const user = await prisma.user.findUnique({
      where: { id: decodedRaw.sub },
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

    // ===============================
    // 4. Normalisasi roles & permissions
    // ===============================
    const roles = user.roles.map((r) => r.role.name);

    const permissions = Array.from(
      new Set(
        user.roles.flatMap((r) =>
          r.role.permissions.map((p) => p.permission.name)
        )
      )
    );

    // ===============================
    // 5. Response
    // ===============================
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
