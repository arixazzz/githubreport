"use client";

import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import TitleHeader from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { formatDate } from "@/lib/utils";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  RefreshCw,
  RotateCcw,
  User as UserIcon,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import React, { use, useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { usePermission } from "@/hooks/useGetPermission"; // Added import

interface Project {
  id: number;
  title: string;
  githubOwner: string;
  githubRepo: string;
  developers?: any[];
}

interface User {
  id: number;
  nama: string;
  email: string;
  usernamegithub: string;
  position: string | null;
}

interface Report {
  id: number;
  projectId: number;
  userId: number;
  conclusion: string;
  commitDate: string; // ISO date string
  commitRange: string;
  createdAt: string;
  user?: User;
}

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function Page(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const { id } = params;

  // -- STATE --
  const [project, setProject] = useState<Project | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // To detect if admin or normal user
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);

  // Filters
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>("ALL");

  // Loading state for single day generation / regeneration
  const [generatingDate, setGeneratingDate] = useState<string | null>(null);
  const [regeneratingDate, setRegeneratingDate] = useState<string | null>(null);

  // Batch Generation State
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);

  const { roles } = usePermission();
  const isAdmin = roles.includes("ADMIN");

  // -- 1. FETCH PROJECT & USER INFO --
  useEffect(() => {
    async function init() {
      try {
        setLoadingProject(true);
        // Get Project
        const resProj = await fetch(`/api/project/get/${id}`);
        if (resProj.ok) {
          const json = await resProj.json();
          const projData = Array.isArray(json.project)
            ? json.project[0]
            : json.project;
          setProject(projData);
        }

        // Get Current User (to know who is viewing)
        // Accessing session user usually requires an endpoint or passing prop.
        // For now, we assume if project.developers exists, we can match.
        // Actually api/auth/me is usually the way. Let's try to infer from "developers" list if possible,
        // or just rely on the fact that if we are admin we see the dropdown.
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoadingProject(false);
      }
    }
    init();
  }, [id]);

  // -- 2. FETCH REPORTS --
  const fetchReports = useCallback(async () => {
    try {
      setLoadingReports(true);
      const res = await fetch(`/api/report/get/${id}`);
      if (res.ok) {
        const json = await res.json();
        setReports(json.reports || []);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoadingReports(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // -- 3. GENERATE LIST OF DAYS --
  // Returns array of Date objects for the selected month/year
  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const daysList = getDaysInMonth(selectedMonth, selectedYear);

  // -- 4. MATCH REPORTS TO DAYS --
  // We need to filter reports by:
  // - selectedDeveloperId (if "ALL", show reports for all? No, usually report view is person-centric)
  //   Let's default "ALL" to "My Reports" if not admin, or just show all mixed?
  //   The prompt said "admin dia bisa memilih username".
  //   If "ALL" is selected, the Calendar View might get messy if multiple people have reports on same day.
  //   Better to force select a developer OR assume "ALL" shows "Any report found".
  //   Let's check if the user is in the developers list.

  const filteredReports = reports.filter((r) => {
    const rDate = new Date(r.commitDate);
    const sameMonth =
      rDate.getMonth() === selectedMonth &&
      rDate.getFullYear() === selectedYear;

    if (!sameMonth) return false;

    if (selectedDeveloperId !== "ALL") {
      return String(r.userId) === selectedDeveloperId;
    }
    return true;
  });

  // -- 5. ACTION: GENERATE REPORT FOR A SPECIFIC DATE --
  const handleGenerate = async (date: Date) => {
    // FIX: Do not use toISOString() because it converts to UTC and might shift the date back.
    // Use manual formatting to keep local date.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    try {
      setGeneratingDate(dateStr);

      const payload: any = { date: dateStr };
      if (selectedDeveloperId !== "ALL") {
        payload.developerId = selectedDeveloperId;
      }

      const res = await fetch(`/api/report/generate/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal generate laporan");

      // Success
      alert(`Laporan tanggal ${dateStr} berhasil dibuat!`);
      fetchReports(); // Refresh data
    } catch (error: any) {
      alert(error.message);
    } finally {
      setGeneratingDate(null);
    }
  };

  // -- 6. ACTION: REGENERATE REPORT (overwrite existing) --
  const handleRegenerate = async (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    if (
      !confirm(
        `Regenerate akan mengganti laporan yang sudah ada untuk tanggal ${dateStr}. Model AI akan menganalisis ulang diff kode dari GitHub. Lanjutkan?`
      )
    )
      return;

    try {
      setRegeneratingDate(dateStr);

      const payload: any = { date: dateStr, regenerate: true };
      if (selectedDeveloperId !== "ALL") {
        payload.developerId = selectedDeveloperId;
      }

      const res = await fetch(`/api/report/generate/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal regenerate laporan");

      fetchReports();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setRegeneratingDate(null);
    }
  };

  // Helper to find reports for a specific day
  const getReportsForDay = (day: Date) => {
    // FIX: Use local date string construction to match handleGenerate logic
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, "0");
    const d = String(day.getDate()).padStart(2, "0");
    const dayStr = `${year}-${month}-${d}`;
    return filteredReports.filter((r) => r.commitDate.startsWith(dayStr));
  };

  // -- EXPORT EXCEL --
  const handleExportExcel = () => {
    if (filteredReports.length === 0) {
      alert("Tidak ada data laporan untuk diexport pada bulan ini.");
      return;
    }

    const dataToExport = filteredReports.map((r, index) => ({
      No: index + 1,
      Tanggal: new Date(r.commitDate).toLocaleDateString("id-ID"),
      Developer: r.user?.nama || "Unknown",
      "Ringkasan Aktivitas": r.conclusion,
      "Commit SHA": r.commitRange,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");
    XLSX.writeFile(
      workbook,
      `Laporan_${project?.title}_${MONTHS[selectedMonth]}_${selectedYear}.xlsx`
    );
  };

  // -- EXPORT PDF --
  const handleExportPDF = () => {
    if (filteredReports.length === 0) {
      alert("Tidak ada data laporan untuk diexport pada bulan ini.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`Laporan Proyek: ${project?.title}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Periode: ${MONTHS[selectedMonth]} ${selectedYear}`, 14, 22);
    doc.text(`Repo: ${project?.githubOwner}/${project?.githubRepo}`, 14, 28);

    const tableData = filteredReports.map((r, i) => [
      i + 1,
      new Date(r.commitDate).toLocaleDateString("id-ID"),
      r.user?.nama || "-",
      r.conclusion,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["No", "Tanggal", "Developer", "Aktivitas"]],
      body: tableData,
    });

    doc.save(
      `Laporan_${project?.title}_${MONTHS[selectedMonth]}_${selectedYear}.pdf`
    );
  };

  // -- BATCH GENERATE (Monthly) --
  const handleBatchGenerate = async () => {
    if (!project) return;

    // Safety check for Admin "ALL" to warn user
    const targetDevCount =
      isAdmin && (!selectedDeveloperId || selectedDeveloperId === "ALL")
        ? project.developers?.length || 0
        : 1;

    const confirmMsg =
      targetDevCount > 1
        ? `Warning: Mode 'Semua Developer' akan memproses ${targetDevCount} developer x hari di bulan ini. Proses ini bisa memakan waktu. Lanjutkan?`
        : "Generate laporan untuk sebulan full (dari tanggal 1 sampai hari ini)?";

    if (!confirm(confirmMsg)) return;

    setIsBatchGenerating(true);
    setBatchProgress("Persiapan...");
    setProgressPercent(0);

    try {
      // 1. Determine Date Range
      // Start: 1st of selected Year-Month
      const startDate = new Date(selectedYear, selectedMonth, 1);

      const now = new Date();
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0); // Last day of month

      // Effective end date is Today if we are in the target month, otherwise end of month.
      // But we should not generate mostly for FUTURE dates.
      let effectiveEndDate = endOfMonth;
      if (now < endOfMonth) {
        effectiveEndDate = now;
      }

      // If selected month is future, abort
      if (startDate > now) {
        throw new Error("Tidak bisa generate laporan untuk bulan masa depan.");
      }

      // Generate array of date strings YYYY-MM-DD
      const datesToProcess: string[] = [];
      const curr = new Date(startDate);
      // Loop until effective end date
      while (curr <= effectiveEndDate) {
        const y = curr.getFullYear();
        const m = String(curr.getMonth() + 1).padStart(2, "0");
        const d = String(curr.getDate()).padStart(2, "0");
        datesToProcess.push(`${y}-${m}-${d}`);

        curr.setDate(curr.getDate() + 1);
      }

      // 2. Determine Targets (Developers)
      let targetDevelopers: {
        id: string;
        user: { nama: string; usernamegithub: string };
      }[] = [];

      if (isAdmin) {
        if (selectedDeveloperId && selectedDeveloperId !== "ALL") {
          // Specific dev
          const dev = project.developers?.find(
            (d: any) => String(d.user.id) === selectedDeveloperId
          );
          if (dev) targetDevelopers = [dev];
        } else {
          // All devs
          targetDevelopers = project.developers || [];
        }
      } else {
        // Self (User)
        // We pass developerId=undefined to API to imply "Self".
        // We create a dummy target for the loop.
        targetDevelopers = [
          { id: "", user: { nama: "Anda", usernamegithub: "-" } },
        ];
      }

      const totalOps = targetDevelopers.length * datesToProcess.length;
      if (totalOps === 0) throw new Error("Tidak ada target operasi.");

      let completedOps = 0;

      // 3. Loop Execution
      for (const dev of targetDevelopers) {
        for (const dateStr of datesToProcess) {
          const devName = dev.user.nama;
          const pct = Math.round((completedOps / totalOps) * 100);
          setBatchProgress(`[${pct}%] Memproses ${devName} @ ${dateStr}...`);
          setProgressPercent(pct);

          try {
            // Sequential Await
            const payload: any = { date: dateStr };
            if (dev.id) payload.developerId = dev.id; // Only add if we have ID (admin case)

            await fetch(`/api/report/generate/${id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          } catch (e) {
            console.error(`Gagal generate ${dateStr} untuk ${devName}`, e);
          }

          completedOps++;
        }
      }

      setBatchProgress("Selesai!");
      setProgressPercent(100);
      alert("Batch Generation Selesai!");
      fetchReports(); // Refresh table
    } catch (err: any) {
      console.error("Batch Error:", err);
      alert("Error: " + err.message);
    } finally {
      setIsBatchGenerating(false);
      setBatchProgress("");
    }
  };

  // -- RENDER --
  if (loadingProject) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Card className="p-6 min-h-screen">
      <BreadcrumbSetItem
        items={[
          { title: "Listing Project", href: "/listing-project" },
          { title: "Laporan Bulanan" },
        ]}
      />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-6">
        <div>
          <TitleHeader title={project?.title || "Laporan Project"} />
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <ExternalLink className="w-4 h-4" />
            <span className="font-mono">
              {project?.githubOwner}/{project?.githubRepo}
            </span>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Developer Selector (Admin Only) */}
          {isAdmin && (
            <div className="w-[200px]">
              <Select
                value={selectedDeveloperId}
                onValueChange={setSelectedDeveloperId}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Pilih Developer" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Developer</SelectItem>
                  {project?.developers?.map((dev: any) => (
                    <SelectItem key={dev.user.id} value={String(dev.user.id)}>
                      {dev.user.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Month Selector */}
          <div className="w-[140px]">
            <Select
              value={String(selectedMonth)}
              onValueChange={(v) => setSelectedMonth(Number(v))}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-gray-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Selector */}
          <div className="w-[100px]">
            <Select
              value={String(selectedYear)}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2024, 2025, 2026].map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 border-l pl-4 ml-2">
            <Button
              variant="outline"
              size="icon"
              title="Export Excel"
              onClick={handleExportExcel}
              className="text-green-600 hover:bg-green-50 border-green-200"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Export PDF"
              onClick={handleExportPDF}
              className="text-red-600 hover:bg-red-50 border-red-200"
            >
              <FileText className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* BATCH ACTION AREA */}
      <div className="mb-6 p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-blue-900">
          <p className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Generate Laporan Bulanan
          </p>
          <p className="text-xs text-blue-600/80 mt-1 opacity-90">
            Otomatis mengisi laporan dari tanggal 1 sampai hari ini (
            {new Date().getDate()}/{new Date().getMonth() + 1}).
            {isAdmin &&
              (!selectedDeveloperId || selectedDeveloperId === "ALL") &&
              " (Untuk SEMUA Developer)"}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {isBatchGenerating ? (
            <div className="flex-1 md:w-[300px] flex flex-col gap-1">
              <div className="flex justify-between text-xs font-medium text-blue-700">
                <span className="truncate max-w-[200px]">{batchProgress}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleBatchGenerate}
              disabled={loadingProject || isBatchGenerating}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Full Month
            </Button>
          )}
        </div>
      </div>

      {/* CALENDAR LIST VIEW */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Tanggal</TableHead>
              <TableHead className="w-[150px]">Status</TableHead>
              <TableHead>Ringkasan Aktivitas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {daysList.map((day) => {
              const dayStr = formatDate(day); // e.g., "Senin, 21 Desember 2025"
              const dayReports = getReportsForDay(day);
              const hasReports = dayReports.length > 0;
              const isToday = day.toDateString() === new Date().toDateString();
              const isFuture = day > new Date();

              // Manual date formatting for 'isGeneratingThis' comparison
              const gYear = day.getFullYear();
              const gMonth = String(day.getMonth() + 1).padStart(2, "0");
              const gDay = String(day.getDate()).padStart(2, "0");
              const currentDateStr = `${gYear}-${gMonth}-${gDay}`;

              const isGeneratingThis = generatingDate === currentDateStr;

              return (
                <TableRow
                  key={day.toISOString()}
                  className={isToday ? "bg-blue-50/50" : ""}
                >
                  <TableCell className="font-medium align-top">
                    <div className="flex flex-col">
                      <span>{dayStr}</span>
                      {isToday && (
                        <span className="text-[10px] text-blue-600 font-bold uppercase">
                          Hari Ini
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="align-top">
                    {hasReports ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {dayReports.length} Laporan
                      </div>
                    ) : isFuture ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        Belum Waktunya
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        <Clock className="w-3.5 h-3.5" />
                        Belum Ada
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="max-w-[400px]">
                    {hasReports ? (
                      <div className="flex flex-col gap-3">
                        {dayReports.map((report) => (
                          <div
                            key={report.id}
                            className="flex flex-col gap-1 items-start border-l-2 pl-3 border-gray-200"
                          >
                            <Dialog>
                              <DialogTrigger asChild>
                                <div className="group cursor-pointer">
                                  <p className="text-sm text-gray-700 line-clamp-2 whitespace-pre-line group-hover:text-blue-600 transition-colors">
                                    {report.conclusion}
                                  </p>
                                  <span className="text-[10px] text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Klik untuk melihat detail
                                  </span>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Detail Laporan Harian
                                  </DialogTitle>
                                  <div className="flex flex-col gap-1 mt-2 text-sm text-gray-500">
                                    <p>
                                      <strong>Tanggal:</strong>{" "}
                                      {formatDate(day)}
                                    </p>
                                    <p>
                                      <strong>Developer:</strong>{" "}
                                      {report.user?.nama || "Unknown"}
                                    </p>
                                    <p>
                                      <strong>Commit Range:</strong>{" "}
                                      <span className="font-mono bg-gray-100 px-1 rounded">
                                        {report.commitRange}
                                      </span>
                                    </p>
                                  </div>
                                </DialogHeader>
                                <div className="max-h-[60vh] mt-4 p-4 bg-gray-50 rounded-md border text-sm overflow-y-auto">
                                  <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                                    {report.conclusion}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <div className="text-xs text-gray-400 flex gap-2 mt-1">
                              <span className="font-semibold text-gray-600">
                                {report.user?.nama || "Unknown"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        - Tidak ada data aktivitas -
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-right align-top">
                    {!isFuture && (
                      <div className="flex flex-col items-end gap-2">
                        {/* Generate — only if no report yet */}
                        {!hasReports && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => handleGenerate(day)}
                            disabled={
                              isGeneratingThis ||
                              regeneratingDate === currentDateStr ||
                              (isAdmin && selectedDeveloperId === "ALL")
                            }
                          >
                            {isGeneratingThis ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3.5 h-3.5" />
                            )}
                            Generate
                          </Button>
                        )}

                        {/* Regenerate — only if report exists */}
                        {hasReports && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                            onClick={() => handleRegenerate(day)}
                            disabled={
                              regeneratingDate === currentDateStr ||
                              isGeneratingThis ||
                              (isAdmin && selectedDeveloperId === "ALL")
                            }
                          >
                            {regeneratingDate === currentDateStr ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <RotateCcw className="w-3.5 h-3.5" />
                            )}
                            {regeneratingDate === currentDateStr
                              ? "Memperbarui…"
                              : "Regenerate"}
                          </Button>
                        )}

                        {isAdmin && selectedDeveloperId === "ALL" && (
                          <span className="text-[10px] text-red-400 block">
                            Pilih Developer
                          </span>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
