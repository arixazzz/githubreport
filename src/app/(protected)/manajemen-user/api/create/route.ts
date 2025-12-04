export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        usernamegithub: data.username,
      },
    });

    if (user) {
      return NextResponse.json(
        { error: "Username sudah digunakan", status: 400 },
        { status: 400 }
      );
    }

    await prisma.user.create({
      data: {
        usernamegithub: data.username,
        password: data.password,
        nama: data.name,
        email: data.email,
        role: data.role,
      },
    });

    return NextResponse.json(
      { message: "Pengguna berhasil dibuat", status: 200 },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
