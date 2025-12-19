import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST() {
  const cookieStore = cookies();

  (await cookieStore).delete("accessToken");

  return NextResponse.json({ message: "Logout berhasil" }, { status: 200 });
}
