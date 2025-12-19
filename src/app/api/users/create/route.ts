import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { UserCreateSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. AUTH & RBAC Check: Admin Only
    const session = await verifySession("ADMIN");
    if (session instanceof NextResponse) return session;

    const { payload } = session;

    const body = await req.json();

    // 2. Validate input
    const validation = UserCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

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

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create a new user in the database
    const roleName = data.role || "USER";

    await prisma.user.create({
      data: {
        usernamegithub: data.username,
        password: hashedPassword,
        nama: data.name,
        email: data.email,
        position: data.position,
        roles: {
          create: {
            role: {
              connect: {
                name: roleName,
              },
            },
          },
        },
      },
    });

    // Log the activity
    await prisma.logActivity.create({
      data: {
        userId: payload.sub,
        activity: `Admin created user ${data.username}`,
      },
    });

    // Return a success response
    return NextResponse.json(
      { message: "Pengguna berhasil dibuat", status: 201 },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
