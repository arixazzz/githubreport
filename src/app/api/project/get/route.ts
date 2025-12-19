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

    // 2. Fetch Projects with Visibility Filter
    const projects = await prisma.project.findMany({
      where: isAdmin
        ? {}
        : {
            developers: {
              some: {
                userId: payload.sub,
              },
            },
          },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        developers: {
          include: {
            user: {
              select: {
                id: true,
                nama: true,
                usernamegithub: true,
                position: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { project: projects, status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
