export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json();

    const project = await prisma.project.findFirst({
      where: {
        linkgithub: data.linkgithub,
      },
    });

    if (project) {
      return NextResponse.json(
        { error: "Username sudah digunakan", status: 400 },
        { status: 400 }
      );
    }

    await prisma.project.create({
      data: {
        linkgithub: data.linkgithub,
        title: data.title,
        detail: data.detail,
        deadline: data.deadline,
        stack: data.stack,
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
