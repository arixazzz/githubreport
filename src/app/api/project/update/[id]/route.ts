import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { ProjectSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function PUT(
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

    // 1. AUTH & RBAC
    const session = await verifySession("ADMIN");
    if (session instanceof NextResponse) return session;

    const { payload } = session;

    // 2. VALIDATION (Partial for partial updates)
    const body = await req.json();
    const validation = ProjectSchema.partial().safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 3. PROCESSING REPO DATA
    let githubUpdateData = {};
    if (data.githubRepo) {
      const parts = data.githubRepo.split("/");
      githubUpdateData = {
        githubOwner: parts[0],
        githubRepo: parts[1],
      };
    }

    // 4. UPDATE PROJECT
    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: data.title,
        detail: data.detail,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        stack: data.stack,
        visibility: data.visibility as any,
        ...githubUpdateData,
      },
    });

    // 5. LOG ACTIVITY
    await prisma.logActivity.create({
      data: {
        userId: payload.sub,
        activity: `User updated project: ${project.title}`,
      },
    });

    return NextResponse.json(
      { message: "Project updated successfully", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
