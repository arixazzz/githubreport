export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json(); // ambil body dari request

  try {
    const report = await prisma.report.update({
      where: { id: Number(id) },
      data: {
        conclusion: data.conclusion,
      },
    });

    return NextResponse.json({ report, status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
