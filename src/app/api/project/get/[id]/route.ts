import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Get 'id' from the route parameters

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  // Validate that 'id' is a valid number
  const projectId = Number(id);
  if (isNaN(projectId)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    // Fetch the project with its associated developers
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        developers: {
          include: {
            user: true, // Include user details (such as name, position, etc.)
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error); // Log for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
