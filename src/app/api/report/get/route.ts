import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // 1. AUTH & RBAC Check
    const session = await verifySession();
    if (session instanceof NextResponse) return session;

    const { payload } = session;
    const isAdmin = payload.roles.includes("ADMIN");

    // 2. Fetch reports based on role
    const reports = await prisma.report.findMany({
      where: isAdmin
        ? {}
        : {
            userId: payload.sub,
          },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            githubOwner: true,
            githubRepo: true,
          },
        },
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            position: true,
            usernamegithub: true,
          },
        },
      },
      orderBy: {
        commitDate: "desc",
      },
    });

    return NextResponse.json({ reports, status: 200 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
