import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { cookies } from "next/headers";

export const runtime = "nodejs";

async function fetchCommitDiff(
  repoOwner: string,
  repoName: string,
  sha: string,
  githubToken: string
): Promise<
  {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    patch?: string;
  }[]
> {
  const res = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${sha}`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "Next.js-App",
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.files || []).map((f: any) => ({
    filename: f.filename,
    status: f.status,
    additions: f.additions || 0,
    deletions: f.deletions || 0,
    // Truncate very large patches to avoid token limits
    patch: f.patch
      ? f.patch.length > 3000
        ? f.patch.substring(0, 3000) + "\n... [truncated]"
        : f.patch
      : undefined,
  }));
}

function buildCodeContext(
  commits: any[],
  fileDiffs: Record<
    string,
    ReturnType<typeof fetchCommitDiff> extends Promise<infer T> ? T : never
  >
): string {
  return commits
    .map((c: any) => {
      const sha = c.sha;
      const message = c.commit.message;
      const files = fileDiffs[sha] || [];

      const fileSection = files
        .filter((f) => f.patch)
        .map(
          (f) =>
            `diff --git a/${f.filename} b/${f.filename}\n` +
            `--- Status: ${f.status} | +${f.additions} -${f.deletions}\n` +
            f.patch
        )
        .join("\n\n");

      return (
        `commit ${sha.substring(0, 7)}\n` +
        `Message: ${message}\n` +
        (fileSection ? `\n${fileSection}` : "")
      );
    })
    .join("\n\n══════════════════════════════\n\n");
}

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

    // 3. Parse Request Body
    const body = await req.json().catch(() => ({}));
    const targetDateStr = body.date || new Date().toISOString().split("T")[0];
    const isRegenerate = body.regenerate === true;

    const [y, m, d] = targetDateStr.split("-").map(Number);
    const targetDate = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));

    let targetUserId = userId;
    let githubAuthor = "";

    if (isAdmin && body.developerId) {
      targetUserId = Number(body.developerId);
    }

    // 4. Get GitHub Username of the target user
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

    // 5. Fetch GitHub Commits for the Specific Day and Author
    const repoOwner = project.githubOwner;
    const repoName = project.githubRepo;

    // Use WIB timezone range (UTC+7)
    const since = new Date(`${targetDateStr}T00:00:00+07:00`).toISOString();
    const until = new Date(`${targetDateStr}T23:59:59+07:00`).toISOString();

    console.log("[report/generate] GitHub API Debug:", {
      repoOwner,
      repoName,
      githubAuthor,
      targetDateStr,
      since,
      until,
      isRegenerate,
    });

    const githubApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits?author=${githubAuthor}&since=${since}&until=${until}&per_page=20`;

    const commitsRes = await fetch(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "Next.js-App",
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!commitsRes.ok) {
      const errorData = await commitsRes.json();
      console.error("[report/generate] GitHub API Error:", {
        status: commitsRes.status,
        message: errorData.message,
        githubApiUrl,
      });
      return NextResponse.json(
        {
          error: `GitHub API Error: ${errorData.message || "Failed to fetch commits"} (repo: ${repoOwner}/${repoName}, author: ${githubAuthor})`,
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

    const latestSha = commits[0].sha;

    // 6. Fetch diff for each commit (up to 5 commits, 8 files each)
    const diffsMap: Record<string, any[]> = {};
    const commitSlice = commits.slice(0, 5);
    await Promise.all(
      commitSlice.map(async (c: any) => {
        diffsMap[c.sha] = await fetchCommitDiff(
          repoOwner,
          repoName,
          c.sha,
          githubToken
        );
      })
    );

    // 7. Build rich code context
    const codeContext = buildCodeContext(commitSlice, diffsMap as any);

    // Also build simple commit message list for the prompt header
    const commitSummary = commitSlice
      .map(
        (c: any, i: number) =>
          `${i + 1}. [${c.sha.substring(0, 7)}] ${c.commit.message.split("\n")[0]}`
      )
      .join("\n");

    // Count total stats
    const totalFiles = Object.values(diffsMap).flat().length;
    const totalAdditions = Object.values(diffsMap)
      .flat()
      .reduce((a, f) => a + f.additions, 0);
    const totalDeletions = Object.values(diffsMap)
      .flat()
      .reduce((a, f) => a + f.deletions, 0);

    // 8. Call AI (Groq) with comprehensive prompt
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "Server configuration error: AI Key missing" },
        { status: 500 }
      );
    }

    const systemPrompt = `Anda adalah asisten teknis yang bertugas membuat ringkasan aktivitas harian developer dalam Bahasa Indonesia berdasarkan commit GitHub dan perubahan kode (code diff) yang diberikan.

Tugas Anda adalah menganalisis setiap perubahan secara menyeluruh, lalu membuat ringkasan yang fokus pada apa yang dicapai hari ini (fitur baru, perbaikan bug, refactoring, dll).

Aturan Format Output:
1. Hanya gunakan format poin-poin singkat menggunakan simbol • (maksimal 4 poin).
2. Setiap poin harus jelas, padat, dan langsung menjelaskan inti perubahan kode.
3. Jangan menyertakan judul, teks pengantar, statistik commit/baris, nama developer, tanggal, header, atau bagian detail teknis lainnya.
4. Output harus berupa daftar poin-poin langsung.`;

    const userContent = `Proyek: ${project.title}
Developer: ${targetUser.nama} (@${githubAuthor})
Tanggal: ${targetDateStr}
Statistik: ${commitSlice.length} commit · ${totalFiles} file diubah · +${totalAdditions} / -${totalDeletions} baris

Daftar Commit:
${commitSummary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERUBAHAN KODE LENGKAP (Code Diff):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${codeContext}`;

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
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
          ],
          max_tokens: 2048,
          temperature: 0.3,
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

    // 9. Save/Update Report to Database (upsert = works for both generate & regenerate)
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

    // 10. Log Activity
    const action = isRegenerate ? "Regenerated" : "Generated";
    await prisma.logActivity.create({
      data: {
        userId,
        activity: `${action} daily report for ${targetUser.nama} on ${targetDateStr} for project: ${project.title}`,
      },
    });

    return NextResponse.json(
      {
        message: `Laporan harian untuk ${targetUser.nama} tanggal ${targetDateStr} berhasil ${isRegenerate ? "diperbarui" : "dibuat"}`,
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
