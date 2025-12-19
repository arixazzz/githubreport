import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. AUTH & RBAC Check: Admin Only
    const session = await verifySession("ADMIN");
    if (session instanceof NextResponse) return session;

    const { id } = params;
    const userId = Number(id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    // Delete user
    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json(
      { message: "User deleted successfully", status: 200 },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
