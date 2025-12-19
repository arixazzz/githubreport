import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid Project ID" },
        { status: 400 }
      );
    }

    // 1. AUTH & RBAC Verification
    const session = await verifySession();
    if (session instanceof NextResponse) return session;

    const { payload } = session;
    const userId = payload.sub;
    const isAdmin = payload.roles.includes("ADMIN");

    // 2. Fetch Reports with RBAC
    // Admin: Get all reports for the project
    // User: Only get reports they created for the project
    const reports = await prisma.report.findMany({
      where: {
        projectId: projectId,
        ...(isAdmin ? {} : { userId: userId }),
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            githubRepo: true,
          },
        },
        user: {
          select: {
            id: true,
            nama: true,
            email: true,
            position: true,
          },
        },
      },
      orderBy: {
        commitDate: "desc",
      },
    });

    return NextResponse.json(
      {
        reports,
        status: 200,
        metadata: {
          total: reports.length,
          isAdmin,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
