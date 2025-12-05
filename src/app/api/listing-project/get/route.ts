export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const project = await prisma.project.findMany();
    return NextResponse.json({ project, status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
