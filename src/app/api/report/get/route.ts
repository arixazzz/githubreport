import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
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
      console.log("Decoded Token:", decoded); // Log the decoded token for inspection
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Ensure Prisma client is initialized correctly
    console.log("Prisma Client Initialized:", prisma); // Log prisma client

    // Fetch reports only for the current user based on userId
    const reports = await prisma.report.findMany({
      where: {
        userId: decoded.userId, // Ensure userId is correctly passed
      },
      include: {
        project: true, // Include related project data
        user: true, // Include related user data
      },
    });

    console.log("Fetched Reports:", reports); // Log fetched reports

    if (!reports) {
      return NextResponse.json(
        { error: "No reports found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ reports, status: 200 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching reports:", error); // Log error for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
