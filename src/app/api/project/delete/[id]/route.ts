import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(
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

    // 1. AUTH & RBAC (ADMIN ONLY)
    const session = await verifySession("ADMIN");
    if (session instanceof NextResponse) return session;

    const { payload } = session;

    // 2. CHECK PROJECT EXISTS
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 3. DELETE PROJECT
    await prisma.project.delete({
      where: { id: projectId },
    });

    // 4. LOG ACTIVITY
    await prisma.logActivity.create({
      data: {
        userId: payload.sub,
        activity: `User deleted project: ${project.title} (${project.githubOwner}/${project.githubRepo})`,
      },
    });

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
