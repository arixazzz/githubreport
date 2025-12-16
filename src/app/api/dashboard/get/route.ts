import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure Prisma is correctly configured
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Retrieve the access token from cookies
    const cookieStore = cookies();
    const dataToken = (await cookieStore).get("accessToken")?.value;

    if (!dataToken) {
      // If the access token is not found, return an error response
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
      ) as { userId: number };

      console.log("Decoded Token:", decoded); // Log the decoded token for inspection
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Fetch the necessary data for the dashboard
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({
      where: {
        deadline: {
          gte: new Date(), // Active projects have a future deadline
        },
      },
    });

    const totalDevelopers = await prisma.developer.count();

    const recentActivities = await prisma.logActivity.findMany({
      take: 5,
      orderBy: {
        timestamp: "desc", // Sort activities by the most recent
      },
      include: {
        user: true, // Include user data for each activity
      },
    });

    const recentReports = await prisma.report.findMany({
      take: 5,
      orderBy: {
        timestamp: "desc", // Sort reports by the most recent
      },
      include: {
        project: true, // Include related project data
        user: true, // Include user who generated the report
      },
    });

    // Return all the fetched data in the response
    return NextResponse.json(
      {
        totalProjects,
        activeProjects,
        totalDevelopers,
        recentActivities,
        recentReports,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard data:", error); // Log error for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
