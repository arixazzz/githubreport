export const runtime = "nodejs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export const generateAccesToken = function (
  payload: JwtPayloadInterface,
  secretToken: string,
  expiresIn: number
): string {
  return jwt.sign(payload, secretToken, { expiresIn });
};

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code not found" }, { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GITHUB_ID,
      client_secret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
      code,
    }),
  });

  const tokenData = (await tokenRes.json()) as GitHubTokenResponse;
  const accessToken = tokenData.access_token;

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Next.js",
    },
  });

  const user = (await userRes.json()) as GitHubUser;

  (await cookies()).set({
    name: "githubToken",
    value: accessToken,
  });

  const existingUser = await prisma.user.findFirst({
    where: { usernamegithub: user.login },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        usernamegithub: user.login ?? "contoh",
        nama: user?.name ?? "contoh",
        email: user?.email ?? "",
        password: "password",
        role: "USER",
      },
    });
  }

  const tokenPayload: JwtPayloadInterface = {
    userId: Number(existingUser?.id),
    email: existingUser?.email as string,
    name: existingUser?.nama as string,
    role: existingUser?.role as "USER" | "ADMIN",
  };

  const secretToken = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ?? "";
  const token = generateAccesToken(
    tokenPayload,
    String(secretToken),
    3600 * 24
  ); // 1 day

  (await cookies()).set({
    name: "accessToken",
    value: token,
  });

  // localStorage.setItem("githubToken", accessToken);
  // localStorage.setItem("token", btoa(JSON.stringify(user)));
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
