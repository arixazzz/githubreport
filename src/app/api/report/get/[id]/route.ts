import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params; // Retrieve the projectId from the URL parameters

    // Retrieve the access token from cookies
    const cookieStore = cookies();
    const dataToken = (await cookieStore).get("accessToken")?.value;

    if (!dataToken) {
      return NextResponse.json(
        { error: "Access token is missing" },
        { status: 401 }
      );
    }

    // Decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(
        dataToken,
        process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ?? ""
      ) as { name: string; userId: number };
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Fetch reports for the specific project and the current user
    const reports = await prisma.report.findMany({
      where: {
        projectId: Number(id), // Fetch reports by projectId
        userId: decoded.userId, // Ensure we only get reports for the logged-in user
      },
      include: {
        project: true, // Include related project data
        user: true, // Include related user data
      },
    });

    if (!reports || reports.length === 0) {
      return NextResponse.json(
        { error: "No reports found for this project" },
        { status: 404 }
      );
    }

    return NextResponse.json({ reports, status: 200 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports by project:", error); // Log error for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
