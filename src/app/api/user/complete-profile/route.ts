import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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

export async function POST(req: NextRequest) {
  try {
    // ===============================
    // 1. AMBIL TOKEN
    // ===============================
    const cookieStore = cookies();
    const token = (await cookieStore).get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ===============================
    // 2. VERIFY JWT
    // ===============================
    const raw = jwt.verify(token, process.env.NEXTAUTH_SECRET || "");

    if (!isAccessTokenPayload(raw)) {
      return NextResponse.json(
        { error: "Invalid token structure" },
        { status: 401 }
      );
    }

    const decoded = raw;

    // ===============================
    // 3. GET REQUEST BODY
    // ===============================
    const body = await req.json();
    const { password, position } = body;

    // ===============================
    // 4. VALIDASI INPUT
    // ===============================
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    if (!position || position.trim() === "") {
      return NextResponse.json(
        { error: "Position tidak boleh kosong" },
        { status: 400 }
      );
    }

    // ===============================
    // 5. HASH PASSWORD
    // ===============================
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===============================
    // 6. UPDATE USER
    // ===============================
    const updatedUser = await prisma.user.update({
      where: { id: decoded.sub },
      data: {
        password: hashedPassword,
        position: position.trim(),
      },
    });

    // ===============================
    // 7. LOG ACTIVITY
    // ===============================
    await prisma.logActivity.create({
      data: {
        userId: decoded.sub,
        activity: `User ${updatedUser.usernamegithub} completed profile`,
      },
    });

    // ===============================
    // 8. RESPONSE
    // ===============================
    return NextResponse.json(
      {
        message: "Profil berhasil dilengkapi",
        user: {
          id: updatedUser.id,
          nama: updatedUser.nama,
          usernamegithub: updatedUser.usernamegithub,
          position: updatedUser.position,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error completing profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
