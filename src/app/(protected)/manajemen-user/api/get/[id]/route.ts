export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const id = req.nextUrl.searchParams.get("id");

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    return NextResponse.json({ user, status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
