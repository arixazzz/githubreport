import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tokenName = searchParams.get("tokenParams");

    if (!tokenName) {
      return NextResponse.json(
        { error: "tokenParams is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(tokenName);

    if (!token) {
      return NextResponse.json(
        { error: `Token '${tokenName}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      token,
      message: "Token fetched successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch token" },
      { status: 500 }
    );
  }
}
