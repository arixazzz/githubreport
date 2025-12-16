import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

interface JwtPayloadInterface {
  userId: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export const generateAccesToken = function (
  payload: JwtPayloadInterface,
  secretToken: string,
  expiresIn: number
): string {
  return jwt.sign(payload, secretToken, { expiresIn });
};

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Code not found" }, { status: 400 });
  }

  // Get the GitHub token using the code
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

  // Fetch the GitHub user data
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "Next.js",
    },
  });

  const user = (await userRes.json()) as GitHubUser;

  // Save GitHub token in cookies
  (await cookies()).set({
    name: "githubToken",
    value: accessToken,
  });

  // Check if the user already exists in the database
  let existingUser = await prisma.user.findFirst({
    where: { usernamegithub: user.login },
  });

  if (!existingUser) {
    // If the user doesn't exist, create a new user
    existingUser = await prisma.user.create({
      data: {
        usernamegithub: user.login,
        nama: user?.name ?? user.login,
        email: user?.email ?? null,
        password: "password", // Set a default password or ask the user to change it later
        role: "USER",
      },
    });
  }

  // Prepare JWT payload
  const tokenPayload: JwtPayloadInterface = {
    userId: existingUser.id, // Use the correct user ID
    email: existingUser.email as string,
    name: existingUser.nama as string,
    role: existingUser.role as "USER" | "ADMIN",
  };

  // Generate JWT token
  const secretToken = process.env.NEXT_PUBLIC_NEXTAUTH_SECRET ?? "";
  const token = generateAccesToken(
    tokenPayload,
    String(secretToken),
    3600 * 24 // 1 day expiration
  );

  // Save the JWT token in cookies
  (await cookies()).set({
    name: "accessToken",
    value: token,
  });

  // Log the activity (successful login)
  await prisma.logActivity.create({
    data: {
      userId: existingUser.id, // Log the user ID
      activity: `User ${user.login} logged in successfully`, // Activity description
    },
  });

  // Redirect the user to the dashboard
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  return NextResponse.redirect(new URL("/dashboard", baseUrl));
}
