import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const dataToken = (await cookieStore).get("accessToken")?.value;

  if (!dataToken) {
    return NextResponse.json(
      { error: "Access token is missing" },
      { status: 401 }
    );
  }

  let decoded;
  try {
    decoded = jwtDecode(dataToken) as { name: string; id: number }; // Make sure you decode the user's ID as well
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  try {
    const data = await req.json();

    // Check if the username already exists
    const user = await prisma.user.findFirst({
      where: {
        usernamegithub: data.username,
      },
    });

    if (user) {
      return NextResponse.json(
        { error: "Username sudah digunakan", status: 400 },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        usernamegithub: data.username,
        password: data.password, // Remember to hash the password before saving!
        nama: data.name,
        email: data.email,
        position: data.position,
        role: data.role,
      },
    });

    // Log the activity for the user who performed the action
    await prisma.logActivity.create({
      data: {
        userId: decoded.id, // Log the user who is performing the action
        activity: `Created user ${data.username}`,
      },
    });

    return NextResponse.json(
      { message: "Pengguna berhasil dibuat", status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating user:", error); // Log error for debugging
    return NextResponse.json(
      { error: "Invalid JSON or internal server error" },
      { status: 400 }
    );
  }
}
