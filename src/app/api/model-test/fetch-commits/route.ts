import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Accept either userId (number) or githubUsername (string)
    const { projectId, userId, githubUsername, date } = body;

    if (!projectId || (!userId && !githubUsername) || !date) {
      return NextResponse.json(
        {
          error:
            "projectId, (userId atau githubUsername), dan date wajib diisi",
        },
        { status: 400 }
      );
    }

    // 1. Get GitHub token from cookie
    const cookieStore = await cookies();
    const githubToken = cookieStore.get("githubToken")?.value;

    if (!githubToken) {
      return NextResponse.json(
        {
          error:
            "GitHub token tidak ditemukan. Silakan login ulang via GitHub.",
        },
        { status: 401 }
      );
    }

    // 2. Load project from DB
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project tidak ditemukan" },
        { status: 404 }
      );
    }

    // 3. Resolve GitHub username and optional DB user
    let resolvedUsername: string;
    let dbUser: { id: number; nama: string; usernamegithub: string } | null =
      null;

    if (
      githubUsername &&
      typeof githubUsername === "string" &&
      githubUsername.trim()
    ) {
      // Free-text input: use typed username directly
      resolvedUsername = githubUsername.trim().replace(/^@/, "");
      // Try to find in DB (for display name + existing report lookup)
      dbUser = await prisma.user.findUnique({
        where: { usernamegithub: resolvedUsername },
        select: { id: true, nama: true, usernamegithub: true },
      });
    } else {
      // userId mode (dropdown fallback)
      const found = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { id: true, nama: true, usernamegithub: true },
      });
      if (!found || !found.usernamegithub) {
        return NextResponse.json(
          { error: "User tidak ditemukan atau belum mengatur username GitHub" },
          { status: 404 }
        );
      }
      dbUser = found;
      resolvedUsername = found.usernamegithub;
    }

    // 4. Fetch commits from GitHub for author + date range
    const since = new Date(`${date}T00:00:00+07:00`).toISOString();
    const until = new Date(`${date}T23:59:59+07:00`).toISOString();

    const headers: HeadersInit = {
      Authorization: `Bearer ${githubToken}`,
      "User-Agent": "GitHubReport-ModelTest",
      Accept: "application/vnd.github.v3+json",
    };

    const commitsUrl = `https://api.github.com/repos/${project.githubOwner}/${project.githubRepo}/commits?author=${resolvedUsername}&since=${since}&until=${until}&per_page=15`;
    const commitsRes = await fetch(commitsUrl, { headers });

    if (!commitsRes.ok) {
      const errData = await commitsRes.json().catch(() => ({}));
      if (commitsRes.status === 401) {
        return NextResponse.json(
          { error: "GitHub token tidak valid. Silakan login ulang." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        {
          error:
            errData.message ||
            `GitHub API error: ${commitsRes.status} — ${project.githubOwner}/${project.githubRepo}`,
        },
        { status: commitsRes.status }
      );
    }

    const commitsList: any[] = await commitsRes.json();

    if (!commitsList || commitsList.length === 0) {
      return NextResponse.json(
        {
          error: `Tidak ada commit dari @${resolvedUsername} pada ${date} di project "${project.title}"`,
        },
        { status: 404 }
      );
    }

    // 5. Fetch detailed diffs for each commit (max 5)
    const detailPromises = commitsList.slice(0, 5).map(async (c: any) => {
      const detailRes = await fetch(
        `https://api.github.com/repos/${project.githubOwner}/${project.githubRepo}/commits/${c.sha}`,
        { headers }
      );
      if (!detailRes.ok) return null;
      const detail = await detailRes.json();

      const files = (detail.files || []).slice(0, 8).map((f: any) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions || 0,
        deletions: f.deletions || 0,
        patch: f.patch
          ? f.patch.length > 2500
            ? f.patch.substring(0, 2500) + "\n... [truncated]"
            : f.patch
          : undefined,
      }));

      return {
        sha: detail.sha,
        shortSha: detail.sha.substring(0, 7),
        message: detail.commit.message,
        date: detail.commit.author.date,
        author: detail.commit.author.name,
        files,
        additions: detail.stats?.additions || 0,
        deletions: detail.stats?.deletions || 0,
      };
    });

    const rawResults = await Promise.all(detailPromises);
    const commits = rawResults.filter(Boolean);

    // 6. Check for existing saved report (only when DB user is found)
    let existingSummary: string | null = null;
    if (dbUser) {
      const [y, m, d] = date.split("-").map(Number);
      const commitDate = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
      const existingReport = await prisma.report.findUnique({
        where: {
          projectId_userId_commitDate: {
            projectId: Number(projectId),
            userId: dbUser.id,
            commitDate,
          },
        },
        select: { conclusion: true },
      });
      existingSummary = existingReport?.conclusion ?? null;
    }

    return NextResponse.json({
      project: {
        id: project.id,
        title: project.title,
        githubOwner: project.githubOwner,
        githubRepo: project.githubRepo,
      },
      user: {
        id: dbUser?.id ?? null,
        nama: dbUser?.nama ?? resolvedUsername,
        usernamegithub: resolvedUsername,
      },
      commits,
      existingSummary,
    });
  } catch (err: any) {
    console.error("[model-test/fetch-commits]", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
