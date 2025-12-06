import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Define JwtPayloadInterface (Ensure that you have this interface defined)
interface JwtPayloadInterface {
  userId: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

// Function to generate the access token
export const generateAccesToken = function (
  payload: JwtPayloadInterface,
  secretToken: string,
  expiresIn: number
): string {
  return jwt.sign(payload, secretToken, { expiresIn });
};

export const runtime = "nodejs";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = await req.json(); // Get the body from the request

    // Check if user exists
    const userCheck = await prisma.user.findUnique({
      where: {
        usernamegithub: data.username,
      },
    });

    if (!userCheck) {
      return NextResponse.json(
        { error: "Username tidak ditemukan", status: 400 },
        { status: 400 }
      );
    }

    // Check if password is set
    if (userCheck.password === "password") {
      return NextResponse.json(
        { error: "Silahkan anda buat password terlebih dahulu", status: 400 },
        { status: 400 }
      );
    }

    // Check if password matches
    if (userCheck.password !== data.password) {
      return NextResponse.json(
        { error: "Password tidak cocok", status: 400 },
        { status: 400 }
      );
    }

    // Create the payload for the JWT token
    const tokenPayload: JwtPayloadInterface = {
      userId: Number(userCheck?.id),
      email: userCheck?.email as string,
      name: userCheck?.nama as string,
      role: userCheck?.role as "USER" | "ADMIN",
    };

    // Generate the JWT token
    const secretToken = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ?? "";
    const token = generateAccesToken(
      tokenPayload,
      String(secretToken),
      3600 * 24 // 1 day expiration
    );

    // Set the access token in cookies
    (await cookies()).set({
      name: "accessToken",
      value: token,
    });

    // Log the activity (successful login)
    await prisma.logActivity.create({
      data: {
        userId: userCheck.id, // Store the user ID in the log
        activity: `User ${userCheck.usernamegithub} logged in successfully`,
      },
    });

    return NextResponse.json(
      { message: "Login berhasil", status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
