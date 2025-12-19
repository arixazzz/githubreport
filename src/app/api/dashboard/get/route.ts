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

    // 2. DASHBOARD DATA
    const projectFilter = isAdmin
      ? {}
      : {
          developers: {
            some: {
              userId: payload.sub,
            },
          },
        };

    const totalProjects = await prisma.project.count({
      where: projectFilter,
    });

    const activeProjects = await prisma.project.count({
      where: {
        ...projectFilter,
        deadline: {
          gte: new Date(),
        },
      },
    });

    // Total user
    const totalUsers = await prisma.user.count();

    // Recent Activity
    const recentActivities = await prisma.logActivity.findMany({
      take: 5,
      orderBy: { timestamp: "desc" },
      where: isAdmin
        ? {}
        : {
            userId: payload.sub,
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

    // Recent Reports
    const recentReports = await prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
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
            githubRepo: true,
          },
        },
        user: {
          select: {
            id: true,
            nama: true,
            usernamegithub: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        totalProjects,
        activeProjects,
        totalUsers,
        recentActivities,
        recentReports,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
