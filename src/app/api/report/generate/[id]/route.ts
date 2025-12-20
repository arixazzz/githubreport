import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const projectId = Number(id);

    // 1. AUTH & RBAC Check
    const session = await verifySession();
    if (session instanceof NextResponse) return session;

    const { payload } = session;
    const userId = payload.sub;
    const isAdmin = payload.roles.includes("ADMIN");

    // GitHub token check
    const cookieStore = await cookies();
    const githubToken = cookieStore.get("githubToken")?.value;

    if (!githubToken) {
      return NextResponse.json(
        { error: "GitHub token missing. Silakan login ulang via GitHub." },
        { status: 400 }
      );
    }

    // 2. Fetch Project Detail
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 3. New Request Body: date & developerId (Admin only)
    const body = await req.json().catch(() => ({}));
    const targetDateStr = body.date || new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    let targetUserId = userId;
    let githubAuthor = "";

    if (isAdmin && body.developerId) {
      targetUserId = Number(body.developerId);
    }

    // Get GitHub Username of the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { usernamegithub: true, nama: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Target developer not found" },
        { status: 404 }
      );
    }
    githubAuthor = targetUser.usernamegithub;

    if (!githubAuthor) {
      return NextResponse.json(
        { error: "Target developer does not have a GitHub username" },
        { status: 400 }
      );
    }

    // 4. Fetch GitHub Commits for the Specific Day and Author
    const repoOwner = project.githubOwner;
    const repoName = project.githubRepo;

    // Set since and until for the day
    const since = new Date(targetDateStr);
    since.setHours(0, 0, 0, 0);
    const until = new Date(targetDateStr);
    until.setHours(23, 59, 59, 999);

    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?author=${githubAuthor}&since=${since.toISOString()}&until=${until.toISOString()}`;

    const commitsRes = await fetch(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "Next.js-App",
      },
    });

    if (!commitsRes.ok) {
      const errorData = await commitsRes.json();
      return NextResponse.json(
        {
          error: `GitHub API Error: ${errorData.message || "Failed to fetch commits"}`,
        },
        { status: commitsRes.status }
      );
    }

    const commits = await commitsRes.json();
    if (!commits || commits.length === 0) {
      return NextResponse.json(
        {
          error: `Tidak ditemukan commit untuk ${githubAuthor} pada tanggal ${targetDateStr}`,
        },
        { status: 400 }
      );
    }

    // Collect all commit messages for the summary
    const commitMessages = commits.map((c: any) => c.commit.message).join("\n");
    const latestSha = commits[0].sha;

    // 5. Call AI (Groq) for Summary of the day's activity
    const groqApiKey = process.env.GROQ_API_KEY; // Only use secure key
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "Server configuration error: AI Key missing" },
        { status: 500 }
      );
    }

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "Buat ringkasan aktivitas harian developer di proyek ini dalam Bahasa Indonesia. Fokus pada apa yang dicapai hari ini berdasarkan pesan commit. Gunakan poin-poin singkat (maksimal 4).",
            },
            {
              role: "user",
              content: `Informasi Proyek: ${project.title}\nDeveloper: ${targetUser.nama}\nTanggal: ${targetDateStr}\n\nPesan Commits:\n${commitMessages}`,
            },
          ],
        }),
      }
    );

    if (!groqRes.ok) {
      const errorData = await groqRes.json();
      throw new Error(`Groq API Error: ${JSON.stringify(errorData)}`);
    }

    const groqJson = await groqRes.json();
    const summary =
      groqJson.choices?.[0]?.message?.content ||
      "Gagal menghasilkan ringkasan.";

    // 6. Save Report to Database (Unique per Project-User-Date)
    const newReport = await prisma.report.upsert({
      where: {
        projectId_userId_commitDate: {
          projectId,
          userId: targetUserId,
          commitDate: targetDate,
        },
      },
      update: {
        conclusion: summary,
        commitRange: latestSha.substring(0, 7),
      },
      create: {
        projectId,
        userId: targetUserId,
        conclusion: summary,
        commitDate: targetDate,
        commitRange: latestSha.substring(0, 7),
      },
    });

    // 7. Log Activity
    await prisma.logActivity.create({
      data: {
        userId,
        activity: `Generated daily report for ${targetUser.nama} on ${targetDateStr} for project: ${project.title}`,
      },
    });

    return NextResponse.json(
      {
        message: `Laporan harian untuk ${targetUser.nama} tanggal ${targetDateStr} berhasil dibuat`,
        report: newReport,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Generate report error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
