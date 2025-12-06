import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; // Ensure you're using jwt.verify()

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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
    // Get the body data from the request
    const data = await req.json();

    // Check if the username already exists in the database
    const user = await prisma.user.findFirst({
      where: {
        usernamegithub: data.username,
      },
    });

    // If the username already exists, return an error
    if (user) {
      return NextResponse.json(
        { error: "Username sudah digunakan", status: 400 },
        { status: 400 }
      );
    }

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        usernamegithub: data.username,
        password: data.password, // Make sure to hash the password before saving
        nama: data.name,
        email: data.email,
        position: data.position,
        role: data.role,
      },
    });

    // Log the activity for the user who is performing the action
    await prisma.logActivity.create({
      data: {
        userId: decoded.userId, // Correctly passing userId extracted from JWT
        activity: `Created user ${data.username}`, // Log message
      },
    });

    // Return a success response
    return NextResponse.json(
      { message: "Pengguna berhasil dibuat", status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging purposes
    return NextResponse.json(
      { error: "Invalid JSON or internal server error" },
      { status: 400 }
    );
  }
}
