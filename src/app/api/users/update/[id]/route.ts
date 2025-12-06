import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure your prisma instance is set up correctly

export const runtime = "nodejs";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json(); // Retrieve the body of the request

  console.log("Updating user with ID:", id); // Useful for debugging

  try {
    // Update the user in the database using Prisma
    const user = await prisma.user.update({
      where: { id: Number(id) }, // Convert id to number
      data: {
        nama: data.nama, // Assuming 'name' is the key sent in the request body
        email: data.email,
        position: data.position,
        role: data.role,
      },
    });

    // Return the updated user object as JSON
    return NextResponse.json({ user, status: 200 }, { status: 200 });
  } catch (error) {
    // Log the error for debugging
    console.error("Error updating user:", error);

    // Return a JSON response with an error message and status code 400
    return NextResponse.json(
      { error: "Invalid JSON or user not found" },
      { status: 400 }
    );
  }
}
