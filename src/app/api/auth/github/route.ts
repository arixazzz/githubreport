import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "OAuth code missing" }, { status: 400 });
  }

  // ===============================
  // 1. EXCHANGE CODE → ACCESS TOKEN
  // ===============================
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

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    console.error("GitHub token error:", tokenData);
    return NextResponse.json(
      { error: "Failed to obtain GitHub access token" },
      { status: 401 }
    );
  }

  // ===============================
  // 2. FETCH GITHUB USER
  // ===============================
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "githubreport-platform",
    },
  });

  const ghUser = await userRes.json();

  // 🚨 VALIDASI KRITIS
  if (!ghUser || !ghUser.login) {
    console.error("Invalid GitHub user response:", ghUser);
    return NextResponse.json(
      { error: "Invalid GitHub user data" },
      { status: 400 }
    );
  }

  // ===============================
  // 2.1. FETCH GITHUB USER EMAILS
  // ===============================
  let userEmail = ghUser.email; // Try to get from user profile first

  // If email is not public, fetch from /user/emails endpoint
  if (!userEmail) {
    try {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "githubreport-platform",
        },
      });

      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        // Find primary and verified email
        const primaryEmail = emails.find((e: any) => e.primary && e.verified);
        if (primaryEmail) {
          userEmail = primaryEmail.email;
        } else {
          // Fallback to first verified email
          const verifiedEmail = emails.find((e: any) => e.verified);
          if (verifiedEmail) {
            userEmail = verifiedEmail.email;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching GitHub emails:", error);
    }
  }

  // ===============================
  // 3. FIND / CREATE USER
  // ===============================
  let user = await prisma.user.findUnique({
    where: { usernamegithub: ghUser.login },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    await prisma.user.create({
      data: {
        usernamegithub: ghUser.login,
        nama: ghUser.name ?? ghUser.login,
        email: userEmail ?? null,
      },
    });

    // 🔁 FETCH ULANG (biar roles selalu ada)
    user = await prisma.user.findUnique({
      where: { usernamegithub: ghUser.login },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });
  }

  if (!user) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }

  // ===============================
  // 4. UPDATE EMAIL IF NULL
  // ===============================
  if (!user.email && userEmail) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { email: userEmail },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });
  }

  // ===============================
  // 4. ASSIGN DEFAULT ROLE USER
  // ===============================
  const userRole = await prisma.role.findUnique({
    where: { name: "USER" },
  });

  if (userRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: userRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: userRole.id,
      },
    });
  }

  // ===============================
  // 5. BUILD JWT (RBAC READY)
  // ===============================
  const roles = user.roles.map((r) => r.role.name);
  const permissions = [
    ...new Set(
      user.roles.flatMap((r) =>
        r.role.permissions.map((p) => p.permission.name)
      )
    ),
  ];

  const token = signJwt({
    sub: user.id,
    email: user.email,
    name: user.nama,
    roles,
    permissions,
  });

  // ===============================
  // 6. SET COOKIE
  // ===============================
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Set GitHub access token for API calls (commits etc)
  cookieStore.set("githubToken", tokenData.access_token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // ===============================
  // 7. CHECK PROFILE COMPLETION
  // ===============================
  const isProfileComplete = user.password && user.position;

  // ===============================
  // 8. REDIRECT
  // ===============================
  if (!isProfileComplete) {
    return NextResponse.redirect(new URL("/complete-profile", req.url));
  }

  return NextResponse.redirect(new URL("/dashboard", req.url));
}
