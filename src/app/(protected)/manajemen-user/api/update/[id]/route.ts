export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json(); // ambil body dari request
  console.log(id);
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        nama: data.name,
        email: data.email,
        role: data.role,
      },
    });
    return NextResponse.json({ user, status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
