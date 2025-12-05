"use server";

export const runtime = "nodejs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export const generateAccesToken = function (
  payload: JwtPayloadInterface,
  secretToken: string,
  expiresIn: number
): string {
  return jwt.sign(payload, secretToken, { expiresIn });
};

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json(); // ambil body dari request

    const userCheck = await prisma.user.findUnique({
      where: {
        usernamegithub: data.username,
      },
    });

    if (!userCheck) {
      return NextResponse.json(
        { error: "Username tidak ditemukan", status: 400 },
        { status: 400 }
      );
    }

    if (userCheck.password === "password") {
      return NextResponse.json(
        { error: "Silahkan anda buat password terlebih dahulu", status: 400 },
        { status: 400 }
      );
    }

    if (userCheck.password !== data.password) {
      return NextResponse.json(
        { error: "Password tidak cocok", status: 400 },
        { status: 400 }
      );
    }

    const tokenPayload: JwtPayloadInterface = {
      userId: Number(userCheck?.id),
      email: userCheck?.email as string,
      name: userCheck?.nama as string,
      role: userCheck?.role as "USER" | "ADMIN",
    };

    const secretToken = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ?? "";
    const token = generateAccesToken(
      tokenPayload,
      String(secretToken),
      3600 * 24
    ); // 1 day

    (await cookies()).set({
      name: "accessToken",
      value: token,
    });

    return NextResponse.json(
      { error: "Login berhasil", status: 200 },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
