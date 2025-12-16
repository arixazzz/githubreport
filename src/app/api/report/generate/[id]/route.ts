import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; // Ensure you're using jwt.verify()

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Retrieve the access token from cookies
  const cookieStore = cookies();
  const dataToken = (await cookieStore).get("accessToken")?.value;

  // Check if access token is missing
  if (!dataToken) {
    return NextResponse.json(
      { error: "Access token is missing" },
      { status: 401 }
    );
  }

  let decoded;
  try {
    // Decode and verify the JWT token to extract the user details (name and id)
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

  try {
    const { id } = params;
    // Get the body data from the request
    const data = await req.json();

    console.log(data);

    // Create a new user in the database
    const newReport = await prisma.report.create({
      data: {
        projectId: Number(id),
        userId: decoded.userId,
        conclusion: data.summary,
        timestamp: new Date(),
        commitRange: data.commitRange ?? "",
      },
    });
    // Log the activity for the user who is performing the action
    await prisma.logActivity.create({
      data: {
        userId: decoded.userId, // Correctly passing userId extracted from JWT
        activity: `Created Report Project ID : ${data.id}`, // Log message
      },
    });

    // Return a success response
    return NextResponse.json(
      { message: "Report berhasil dibuat", status: 200 },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
