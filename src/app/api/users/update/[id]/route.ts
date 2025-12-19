import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { UserUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. AUTH & RBAC Check: Admin Only
    const session = await verifySession("ADMIN");
    if (session instanceof NextResponse) return session;

    const { id } = params;
    const body = await req.json();

    // 2. Validate input
    const validation = UserUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Validasi ID
    const userId = Number(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Cek apakah user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};

    if (data.nama !== undefined) updateData.nama = data.nama;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.position !== undefined) updateData.position = data.position;

    // Update user basic info
    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Handle role update if provided
    if (data.role) {
      // Find the role by name
      const role = await prisma.role.findUnique({
        where: { name: data.role },
      });

      if (role) {
        // Delete existing user roles
        await prisma.userRole.deleteMany({
          where: { userId: userId },
        });

        // Create new user role
        await prisma.userRole.create({
          data: {
            userId: userId,
            roleId: role.id,
          },
        });
      }
    }

    // Fetch updated user with specific fields (No Password)
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nama: true,
        usernamegithub: true,
        email: true,
        position: true,
        updatedAt: true,
        roles: {
          select: {
            role: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: {
          ...updatedUser,
          roles: updatedUser?.roles.map((r) => r.role.name) || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
