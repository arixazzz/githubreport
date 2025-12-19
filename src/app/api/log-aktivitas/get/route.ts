import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // 1. AUTH & RBAC
    const session = await verifySession();
    if (session instanceof NextResponse) return session;

    const { payload } = session;
    const isAdmin = payload.roles.includes("ADMIN");

    // 2. GET QUERY PARAMETERS
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // 3. BUILD WHERE CLAUSE
    const whereClause: any = {};

    // RBAC Filter: Admin sees all, User sees only their own
    if (!isAdmin) {
      whereClause.userId = payload.sub;
    }

    // Date Filter
    if (startDate || endDate) {
      whereClause.timestamp = {};

      if (startDate) {
        whereClause.timestamp.gte = new Date(startDate);
      }

      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setDate(endDateTime.getDate() + 1);
        whereClause.timestamp.lt = endDateTime;
      }
    }

    // 4. FETCH LOGS
    const log = await prisma.logActivity.findMany({
      where: whereClause,
      orderBy: {
        timestamp: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            nama: true,
            usernamegithub: true,
          },
        },
      },
    });

    return NextResponse.json({ log }, { status: 200 });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
