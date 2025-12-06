import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(req: NextRequest, res: NextResponse) {
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
      decoded = jwt.decode(dataToken) as { userId: number };
      if (!decoded?.userId) {
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to decode token" },
        { status: 401 }
      );
    }

    // Fetch logs only for the current user based on userId
    const log = await prisma.logActivity.findMany({
      where: {
        userId: decoded.userId, // Filter by the current user's ID
      },
      include: {
        user: true, // Include the related user data (name, email, etc.)
      },
    });

    return NextResponse.json({ log, status: 200 }, { status: 200 });
  } catch (error) {
    console.error("Error fetching logs:", error); // Log error for debugging
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
