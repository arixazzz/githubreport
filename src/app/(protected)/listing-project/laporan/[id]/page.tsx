"use client";

import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { laporanColumns } from "@/components/parts/laporan/column";
import TitleHeader from "@/components/shared/title";
import DataTable from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  detail: string;
  stack: string;
  linkgithub: string;
}

interface User {
  id: number;
  nama: string;
  usernamegithub: string;
  email: string;
  role: "USER" | "ADMIN";
  position: string | null;
}

interface ReportResponse {
  id: number;
  project: Project;
  user: User;
  conclusion: string;
  timestamp: string;
  commitRange: string;
}

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [data, setData] = useState<ReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const [generatedText, setGeneratedText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // ------------------------------------
  // LOAD PROJECT DATA
  // ------------------------------------
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/project/get/${id}`);
        const result = await res.json();
        setProject(result.project);
      } catch (err) {
        console.error("Failed load project:", err);
      }
    }

    loadProject();
  }, [id]);

  // ------------------------------------
  // LOAD REPORT LIST FOR THIS PROJECT
  // ------------------------------------
  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch(`/api/report/get/${id}`);
        const result = await res.json();
        setData(result.reports || []);
      } catch (err) {
        console.error("Failed load reports:", err);
      } finally {
        setIsLoading(false); // FIX: SET LOADING FALSE
      }
    }

    loadReports();
  }, [id]);

  // ------------------------------------
  // LOAD GITHUB TOKEN
  // ------------------------------------
  useEffect(() => {
    async function loadGitToken() {
      try {
        const res = await fetch("/api/auth/get-token?tokenParams=githubToken");
        const result = await res.json();
        setGithubToken(result?.token?.value || null);
      } catch (err) {
        console.error("Failed load token:", err);
      }
    }
    loadGitToken();
  }, []);

  // ------------------------------------
  // GENERATE REPORT VIA GROQ
  // ------------------------------------
  const generateReport = async () => {
    try {
      setIsGenerating(true);
      setGeneratedText("");

      if (!project) throw new Error("Project tidak ditemukan");
      if (!githubToken) throw new Error("Github token tidak ditemukan");

      const repoUrl = project.linkgithub;

      if (!repoUrl.includes("https://api.github.com/repos")) {
        throw new Error(
          "linkgithub harus berupa GitHub API URL, contoh: https://api.github.com/repos/username/repo"
        );
      }

      // GET COMMITS
      const commitsRes = await fetch(`${repoUrl}/commits`, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "User-Agent": "Next.js",
        },
      });

      if (!commitsRes.ok) throw new Error("Gagal fetch commits GitHub");

      const commits = await commitsRes.json();
      if (!commits.length) throw new Error("Tidak ada commit di repo");

      const latestSha = commits[0].sha;

      // GET COMMIT DETAILS
      const commitDetailRes = await fetch(`${repoUrl}/commits/${latestSha}`, {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "User-Agent": "Next.js",
        },
      });

      const commitDetail = await commitDetailRes.json();
      // Ambil max 5 file saja, dan HAPUS field patch karena terlalu besar
      const fixSumary = (commitDetail.files || [])
        .slice(0, 5)
        .map((f: any) => ({
          filename: f.filename,
          status: f.status,
          additions: f.additions,
          deletions: f.deletions,
          changes: f.changes,
        }));

      // SEND TO GROQ
      const groqRes = await fetch("https://api.groq.com/openai/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b", // 🔥 recommended: fast, cheap, large context
          input: `Buat ringkasan commit yang sangat singkat dan mudah dibaca. 
          Gunakan maksimal 4 poin saja. 
          Jangan tampilkan angka baris, jangan tampilkan detail teknis. 
          Fokus pada inti perubahan seperti: menambah fitur, memperbarui file, atau perbaikan.

          Format output:
          - Perubahan 1
          - Perubahan 2
          - Perubahan 3

          Data perubahan:
          ${JSON.stringify(fixSumary, null, 2)}
          `,
        }),
      });

      const groqJson = await groqRes.json();
      console.log("GROQ:", groqJson);

      let summary = "";

      // GROQ FORMAT FIX
      if (groqJson?.output?.[1]?.content) {
        const content = groqJson.output[1].content;

        if (Array.isArray(content)) {
          summary = content
            .map(
              (c: any) => c?.text || c?.content || c?.value || JSON.stringify(c)
            )
            .join("\n");
        } else if (typeof content === "object") {
          summary = JSON.stringify(content, null, 2);
        } else {
          summary = String(content);
        }
      } else if (groqJson?.output_text) {
        summary = groqJson.output_text;
      } else if (groqJson?.choices?.[0]?.message?.content) {
        summary = groqJson.choices[0].message.content;
      } else {
        summary = "Tidak ada output dari GROQ";
      }

      setGeneratedText(summary);
    } catch (err: any) {
      setGeneratedText("Gagal generate report: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ------------------------------------
  // RENDER UI
  // ------------------------------------

  if (isLoading) return <p>Loading...</p>;

  return (
    <Card>
      <BreadcrumbSetItem
        items={[{ title: "Reports" }, { title: "Project Reports" }]}
      />

      <TitleHeader title="Laporan Project" />

      {/* GENERATE BUTTON */}
      <div className="mt-4">
        <Button
          className="w-full py-3 rounded-full"
          disabled={isGenerating || !githubToken}
          onClick={generateReport}
        >
          {isGenerating ? "Generating..." : "Generate Report Otomatis"}
        </Button>
      </div>

      {/* RESULT */}
      {generatedText && (
        <Card className="p-4 mt-4 bg-gray-50">
          <h2 className="font-semibold mb-2 text-xl">Hasil Generate Report</h2>
          <p className="whitespace-pre-line">{generatedText}</p>
        </Card>
      )}

      {/* REPORT TABLE */}
      <div className="mt-4">
        <DataTable columns={laporanColumns} data={data} />
      </div>
    </Card>
  );
};

export default Page;
