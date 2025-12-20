import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("githubToken");

  return NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
}
