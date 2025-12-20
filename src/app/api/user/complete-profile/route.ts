import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. AUTH & SESSION
    const session = await verifySession();
    if (session instanceof NextResponse) return session;

    const { payload } = session;

    // 2. GET REQUEST BODY
    const body = await req.json();
    const { password, position } = body;

    // 3. VALIDASI INPUT
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

    // 4. HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. UPDATE USER
    const updatedUser = await prisma.user.update({
      where: { id: payload.sub },
      data: {
        password: hashedPassword,
        position: position.trim(),
      },
    });

    // 6. LOG ACTIVITY
    await prisma.logActivity.create({
      data: {
        userId: payload.sub,
        activity: `User ${updatedUser.usernamegithub} completed profile`,
      },
    });

    // 7. RESPONSE (Safe: no hash)
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
