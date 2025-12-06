import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Check if the project with the same GitHub link already exists
    const project = await prisma.project.findFirst({
      where: {
        linkgithub: data.linkgithub,
      },
    });

    if (project) {
      return NextResponse.json(
        { error: "Project sudah digunakan", status: 400 },
        { status: 400 }
      );
    }

    // Create a new project and associate selected developers (users)
    const newProject = await prisma.project.create({
      data: {
        linkgithub: data.linkgithub,
        title: data.title,
        detail: data.detail,
        deadline: new Date(data.deadline), // Convert deadline to Date
        stack: data.stack,
      },
    });

    // Now, associate developers (users) with the new project
    const developers = data.developers.map((developerId: number) => ({
      userId: developerId,
      projectId: newProject.id, // Use the newly created project's ID
    }));

    // Create Developer entries to link users with the project
    await prisma.developer.createMany({
      data: developers,
    });
    return NextResponse.json(
      { message: "Project berhasil dibuat", status: 200 },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
