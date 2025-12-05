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
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        detail: data.detail,
        deadline: data.deadline,
        stack: data.stack,
        linkgithub: data.linkgithub,
      },
    });
    return NextResponse.json({ project, status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
