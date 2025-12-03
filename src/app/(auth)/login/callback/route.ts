import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import process from "process";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const body = {
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    client_secret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    code,
  };

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  (await cookies()).set("github_token", data.access_token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
      Accept: "application/json",
    },
  });

  const userData = await userResponse.json();
  console.log("GitHub User Data:", userData);

  const responseData = await prisma.user.upsert({
    where: { usernamegithub: userData.login },
    create: {
      nama: userData.name ?? userData.login,
      email: userData.email ?? `${userData.login}@github.local`,
      usernamegithub: userData.login,
      role: "USER",
    },
    update: {
      nama: userData.name ?? userData.login,
      email: userData.email ?? `${userData.login}@github.local`,
    },
  });

  console.log("Created User:", responseData);

  return Response.redirect(new URL("/dashboard", req.url));
}
