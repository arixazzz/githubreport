import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { ProjectSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. AUTH & RBAC: ADMIN ONLY
    const session = await verifySession("ADMIN");
    if (session instanceof NextResponse) return session;

    const { payload } = session;

    // 2. VALIDASI INPUT
    const body = await req.json();
    const validation = ProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { title, detail, deadline, stack, githubRepo, visibility } =
      validation.data;

    // Parse owner and repo
    const [githubOwner, repoName] = githubRepo.split("/");

    // 3. CEK DUPLIKASI REPO
    const exists = await prisma.project.findUnique({
      where: {
        githubOwner_githubRepo: {
          githubOwner: githubOwner,
          githubRepo: repoName,
        },
      },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Repository sudah terdaftar" },
        { status: 400 }
      );
    }

    // 4. CREATE PROJECT
    const project = await prisma.project.create({
      data: {
        title,
        detail,
        deadline: new Date(deadline),
        stack,
        githubOwner,
        githubRepo: repoName,
        visibility,
      },
    });

    // 5. LOG ACTIVITY
    await prisma.logActivity.create({
      data: {
        userId: payload.sub,
        activity: `User created new project: ${title} (${githubOwner}/${repoName})`,
      },
    });

    return NextResponse.json(
      {
        message: "Project berhasil dibuat",
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
