"use client";

import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { laporanColumns } from "@/components/parts/laporan/column";
import TitleHeader from "@/components/shared/title";
import DataTable from "@/components/table/dataTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState, use, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface Project {
  id: number;
  title: string;
  detail: string;
  stack: string;
  githubOwner: string;
  githubRepo: string;
  developers?: any[];
}

interface User {
  id: number;
  nama: string;
  email: string;
  position: string | null;
}

interface ReportResponse {
  id: number;
  project: Project;
  user: User;
  conclusion: string;
  timestamp: string;
  commitRange: string;
  commitDate: string;
}

const Page = (props: { params: Promise<{ id: string }> }) => {
  const params = use(props.params);
  const { id } = params;

  const [data, setData] = useState<ReportResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState<
    (Project & { developers: any[] }) | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for Daily Report
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>("");

  // ------------------------------------
  // LOAD PROJECT DATA
  // ------------------------------------
  const loadProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/project/get/${id}`);
      if (!res.ok) throw new Error("Gagal memuat data project");
      const result = await res.json();

      // The API returns { project: [ { ... } ] } because of findMany in /api/project/get/route.ts
      // But for a single project get, it might be different. Let's handle both.
      const projectData = Array.isArray(result.project)
        ? result.project[0]
        : result.project;
      setProject(projectData);
    } catch (err: any) {
      console.error("Failed load project:", err);
      setError(err.message);
    }
  }, [id]);

  // ------------------------------------
  // LOAD REPORT LIST FOR THIS PROJECT
  // ------------------------------------
  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/report/get/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          setData([]);
          return;
        }
        throw new Error("Gagal memuat daftar laporan");
      }
      const result = await res.json();
      setData(result.reports || []);
    } catch (err: any) {
      console.error("Failed load reports:", err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProject();
    loadReports();
  }, [loadProject, loadReports]);

  // ------------------------------------
  // GENERATE REPORT (Daily Logic)
  // ------------------------------------
  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch(`/api/report/generate/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          developerId: selectedDeveloperId || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal membuat laporan otomatis");
      }

      alert(result.message || "Laporan berhasil dibuat");
      loadReports(); // Reload the table
    } catch (err: any) {
      console.error("Generate report error:", err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // ------------------------------------
  // RENDER UI
  // ------------------------------------

  return (
    <Card className="p-6">
      <BreadcrumbSetItem
        items={[
          { title: "Listing Project", href: "/listing-project" },
          { title: "Project Reports" },
        ]}
      />

      <div className="flex flex-col mb-8 gap-4 border-b pb-6">
        <div>
          <TitleHeader title={`Laporan Project: ${project?.title || "..."}`} />
          {project && (
            <p className="text-sm text-gray-500 mt-1">
              Repo:{" "}
              <span className="font-mono text-blue-600 font-medium">
                {project.githubOwner}/{project.githubRepo}
              </span>
            </p>
          )}
        </div>

        {/* DAILY REPORT FORM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tanggal Commit
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          {project?.developers && project.developers.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Developer (Admin Only)
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none h-[42px]"
                value={selectedDeveloperId}
                onChange={(e) => setSelectedDeveloperId(e.target.value)}
              >
                <option value="">-- Gunakan akun saya --</option>
                {project.developers.map((dev: any) => (
                  <option key={dev.user.id} value={dev.user.id}>
                    {dev.user.nama} ({dev.user.usernamegithub})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            className="rounded-lg px-6 flex gap-2 h-[42px]"
            disabled={isGenerating || !project}
            onClick={handleGenerateReport}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate Laporan Harian
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm flex items-start gap-3">
          <div className="mt-0.5">⚠️</div>
          <p>{error}</p>
        </div>
      )}

      {/* REPORT TABLE */}
      <div className="mt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Memuat daftar laporan...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-gray-400">
              Belum ada laporan untuk project ini.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Klik tombol di atas untuk membuat laporan pertama.
            </p>
          </div>
        ) : (
          <DataTable columns={laporanColumns} data={data} />
        )}
      </div>
    </Card>
  );
};

export default Page;
