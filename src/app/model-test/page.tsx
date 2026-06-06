"use client";

import { useState, useEffect, useRef } from "react";
import {
  GitCommit,
  ChevronRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  RotateCcw,
  CheckCheck,
  CircleAlert,
  ArrowRight,
  CalendarDays,
  User2,
  Layers,
  AtSign,
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  githubOwner: string;
  githubRepo: string;
  developers: { user: { id: number; nama: string; usernamegithub: string } }[];
}

interface Developer {
  id: number;
  nama: string;
  usernamegithub: string;
}

interface CommitFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

interface CommitDetail {
  sha: string;
  shortSha: string;
  message: string;
  date: string;
  files: CommitFile[];
  additions: number;
  deletions: number;
}

interface FetchResult {
  project: { title: string; githubOwner: string; githubRepo: string };
  user: { id: number | null; nama: string; usernamegithub: string };
  commits: CommitDetail[];
  existingSummary: string | null;
}

interface AspectScore {
  score: number;
  reason: string;
}

interface EvalResult {
  model: string;
  relevance: AspectScore;
  accuracy: AspectScore;
  completeness: AspectScore;
  overall: number;
  feedback: string;
}

function grade(s: number) {
  if (s >= 4)
    return { label: "Excellent", color: "#22c55e", bg: "rgba(34,197,94,.12)" };
  if (s >= 2.5)
    return { label: "Good", color: "#60a5fa", bg: "rgba(96,165,250,.12)" };
  if (s >= 2)
    return { label: "Fair", color: "#fbbf24", bg: "rgba(251,191,36,.12)" };
  return { label: "Poor", color: "#f87171", bg: "rgba(248,113,113,.12)" };
}

function buildCodeContext(commits: CommitDetail[]): string {
  return commits
    .map((c) => {
      const hdr = `commit ${c.sha}\nDate: ${c.date}\n\n    ${c.message}`;
      const diffs = c.files
        .filter((f) => f.patch)
        .map((f) => `diff --git a/${f.filename} b/${f.filename}\n${f.patch}`)
        .join("\n\n");
      return diffs ? `${hdr}\n\n${diffs}` : hdr;
    })
    .join("\n\n─────────────────────────\n\n");
}

function DiffLine({ line }: { line: string }) {
  const isAdd = line.startsWith("+") && !line.startsWith("+++");
  const isDel = line.startsWith("-") && !line.startsWith("---");
  const isHunk = line.startsWith("@@");
  return (
    <div
      className={`flex font-mono text-[11px] leading-[18px] ${
        isAdd
          ? "bg-[#0d2818] text-[#4ade80]"
          : isDel
            ? "bg-[#2d0f0f] text-[#f87171]"
            : isHunk
              ? "bg-[#111827] text-[#93c5fd]"
              : "text-[#6b7280]"
      }`}
    >
      <span className="w-5 shrink-0 text-center opacity-30 select-none">
        {isAdd ? "+" : isDel ? "−" : ""}
      </span>
      <span className="px-2 whitespace-pre-wrap break-all">{line}</span>
    </div>
  );
}

function FileRow({ file }: { file: CommitFile }) {
  const [open, setOpen] = useState(false);
  const color =
    file.status === "added"
      ? "#22c55e"
      : file.status === "removed"
        ? "#f87171"
        : "#fbbf24";

  return (
    <div className="border-t border-[#1a2035]">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2 px-4 py-1.5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <span
          className="text-[9px] font-mono font-bold w-4 text-center uppercase"
          style={{ color }}
        >
          {file.status === "added"
            ? "A"
            : file.status === "removed"
              ? "D"
              : "M"}
        </span>
        <span className="text-[12px] text-[#6b7280] font-mono flex-1 truncate">
          {file.filename}
        </span>
        <span className="text-[11px] text-[#4ade80] tabular-nums">
          +{file.additions}
        </span>
        <span className="text-[11px] text-[#f87171] tabular-nums ml-1">
          −{file.deletions}
        </span>
        {file.patch && (
          <span className="ml-2 text-[#374151]">
            {open ? (
              <EyeOff className="w-3 h-3" />
            ) : (
              <Eye className="w-3 h-3" />
            )}
          </span>
        )}
      </button>
      {open && file.patch && (
        <div className="overflow-x-auto border-t border-[#1a2035]">
          {file.patch.split("\n").map((l, i) => (
            <DiffLine key={i} line={l} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommitCard({ commit }: { commit: CommitDetail }) {
  const [open, setOpen] = useState(false);
  const time = new Date(commit.date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border border-[#1a2035] rounded-lg overflow-hidden bg-[#07090f]">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <code className="text-[11px] text-[#3b82f6] bg-[#1e3a5f]/30 px-2 py-0.5 rounded shrink-0">
          {commit.shortSha}
        </code>
        <span className="text-[13px] text-[#d1d5db] flex-1 truncate leading-snug">
          {commit.message.split("\n")[0]}
        </span>
        <span className="text-[11px] text-[#374151] shrink-0">{time}</span>
        <span className="text-[11px] text-[#4ade80] ml-2">
          +{commit.additions}
        </span>
        <span className="text-[11px] text-[#f87171] ml-1">
          −{commit.deletions}
        </span>
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-[#374151] shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-[#374151] shrink-0" />
        )}
      </button>
      {open && (
        <div className="divide-y divide-[#1a2035]">
          {commit.files.map((f) => (
            <FileRow key={f.filename} file={f} />
          ))}
        </div>
      )}
    </div>
  );
}

function ScoreRow({ label, aspect }: { label: string; aspect: AspectScore }) {
  const g = grade(aspect.score);
  return (
    <div className="py-4 border-b last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] ">{label}</span>
        <div className="flex items-center gap-2">
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-medium"
            style={{ color: g.color, backgroundColor: g.bg }}
          >
            {g.label}
          </span>
          <span
            className="text-[18px] font-semibold tabular-nums"
            style={{ color: g.color }}
          >
            {aspect.score}
            <span className="text-[11px]  font-normal">/5</span>
          </span>
        </div>
      </div>
      <div className="h-1 rounded-full  overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${(aspect.score / 5) * 100}%`,
            backgroundColor: g.color,
          }}
        />
      </div>
      <p className="text-[12px]  leading-relaxed">{aspect.reason}</p>
    </div>
  );
}

export default function ModelTestPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [githubUsername, setGithubUsername] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [fetchResult, setFetchResult] = useState<FetchResult | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [summary, setSummary] = useState("");
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [evalResult, setEvalResult] = useState<EvalResult | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const datalistId = "dev-suggestions";

  useEffect(() => {
    fetch("/api/project/get", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setProjects(d.project || []))
      .catch(() => {})
      .finally(() => setProjectsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      setDevelopers([]);
      return;
    }
    const devs = selectedProject.developers.map((d) => d.user);
    setDevelopers(devs);
    if (devs.length === 1 && !githubUsername) {
      setGithubUsername(devs[0].usernamegithub);
    }
    setFetchResult(null);
    setEvalResult(null);
    setFetchError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  // ── Fetch commits ───────────────────────────────────────────────────────────
  const handleFetch = async () => {
    if (!selectedProject || !githubUsername.trim() || !date) return;
    setFetchLoading(true);
    setFetchError(null);
    setFetchResult(null);
    setEvalResult(null);

    try {
      const res = await fetch("/api/model-test/fetch-commits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projectId: selectedProject.id,
          githubUsername: githubUsername.trim().replace(/^@/, ""),
          date,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengambil data commit");
      setFetchResult(data);
      if (data.existingSummary) setSummary(data.existingSummary);
    } catch (err: any) {
      setFetchError(err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  // ── Evaluate ────────────────────────────────────────────────────────────────
  const handleEvaluate = async () => {
    if (!fetchResult || !summary.trim()) return;
    setEvalLoading(true);
    setEvalError(null);
    setEvalResult(null);

    try {
      const codeContext = buildCodeContext(fetchResult.commits);
      const res = await fetch("/api/model-test/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codeContext,
          summary,
          projectTitle: fetchResult.project.title,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluasi gagal");
      setEvalResult(data);
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100
      );
    } catch (err: any) {
      setEvalError(err.message);
    } finally {
      setEvalLoading(false);
    }
  };

  const handleReset = () => {
    setFetchResult(null);
    setEvalResult(null);
    setFetchError(null);
    setEvalError(null);
    setSummary("");
  };

  const commits = fetchResult?.commits ?? [];
  const totalAdd = commits.reduce((a, c) => a + c.additions, 0);
  const totalDel = commits.reduce((a, c) => a + c.deletions, 0);
  const canFetch =
    selectedProject && githubUsername.trim() && date && !fetchLoading;
  const canEvaluate = commits.length > 0 && summary.trim() && !evalLoading;

  // Matched developer info for display
  const matchedDev = developers.find(
    (d) =>
      d.usernamegithub.toLowerCase() ===
      githubUsername.trim().toLowerCase().replace(/^@/, "")
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-5 py-10 space-y-6">
      <div className="rounded-xl overflow-hidden">
        <div className="p-5 grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium flex items-center gap-1.5">
              <Layers className="w-3 h-3" /> Project
            </label>
            {projectsLoading ? (
              <div className="h-9 rounded-lg animate-pulse" />
            ) : (
              <select
                id="project-select"
                value={selectedProject?.id ?? ""}
                onChange={(e) => {
                  setSelectedProject(
                    projects.find((x) => x.id === Number(e.target.value)) ??
                      null
                  );
                }}
                className=" border  rounded-lg px-3 py-2 text-[13px] outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="">Pilih project…</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}
            {selectedProject && (
              <span className="text-[10px] font-mono ">
                {selectedProject.githubOwner}/{selectedProject.githubRepo}
              </span>
            )}
          </div>

          {/* Developer — free text input with datalist autocomplete */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="dev-input"
              className="text-[11px]  font-medium flex items-center gap-1.5"
            >
              <User2 className="w-3 h-3" /> GitHub Username Developer
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 ">
                <AtSign className="w-3.5 h-3.5" />
              </span>
              <input
                id="dev-input"
                type="text"
                list={datalistId}
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="username atau pilih dari daftar"
                autoComplete="off"
                className="w-full border  rounded-lg pl-8 pr-3 py-2 text-[13px] outline-none transition-all"
              />
              <datalist id={datalistId}>
                {developers.map((d) => (
                  <option key={d.id} value={d.usernamegithub}>
                    {d.nama}
                  </option>
                ))}
              </datalist>
            </div>
            {developers.length > 0 && !githubUsername && (
              <span className="text-[10px] ">
                {developers.length} developer terdaftar di project ini
              </span>
            )}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium flex items-center gap-1.5">
              <CalendarDays className="w-3 h-3" /> Tanggal
            </label>
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-[13px] outline-none transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex items-center gap-3">
          <button
            id="fetch-commits-btn"
            onClick={handleFetch}
            disabled={!canFetch}
            className="flex items-center gap-2 border  disabled:opacity-30 disabled:cursor-not-allowed  text-[13px] font-medium px-5 py-2 rounded-lg transition-colors"
          >
            {fetchLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <GitCommit className="w-3.5 h-3.5" />
            )}
            {fetchLoading ? "Mengambil commit…" : "Ambil Commit & Diff"}
          </button>

          {(fetchResult || fetchError) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-[12px] transition-colors border px-5 py-2 rounded-lg"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {fetchError && (
          <div className="mx-5 mb-4 flex items-start gap-2 p-3 rounded-lg bg-[#f87171]/5 border border-[#f87171]/20">
            <AlertCircle className="w-3.5 h-3.5 text-[#f87171] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#f87171]">{fetchError}</p>
          </div>
        )}
      </div>

      {/* ── Panel 3: Summary input ──────────────────────────────────────────── */}
      {commits.length > 0 && (
        <div className="border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b  flex items-center gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider">
              Summary untuk Dievaluasi
            </span>
            {fetchResult?.existingSummary && (
              <span className="ml-auto text-[10px] text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20 px-2 py-0.5 rounded-full">
                Diisi dari laporan tersimpan
              </span>
            )}
          </div>
          <div className="p-5">
            <p className="text-[12px] mb-3">
              Tempel ringkasan yang dihasilkan model AI (dari halaman generate
              laporan).
            </p>
            <textarea
              id="summary-input"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={`Contoh:\n• Developer melakukan refactoring pada komponen autentikasi\n• Memperbaiki bug validasi form login\n• Menambahkan unit test untuk middleware`}
              rows={5}
              className="w-full  border   rounded-lg px-4 py-3 text-[13px] outline-none transition-all resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-3">
              <button
                id="evaluate-btn"
                onClick={handleEvaluate}
                disabled={!canEvaluate}
                className="flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed  text-[13px] font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {evalLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
                {evalLoading ? "Mengevaluasi…" : "Jalankan Judge"}
              </button>
            </div>
            {evalError && (
              <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-[#f87171]/5 border border-[#f87171]/20">
                <AlertCircle className="w-3.5 h-3.5 text-[#f87171] shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#f87171]">{evalError}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Eval loading */}
      {evalLoading && (
        <div className="border rounded-xl  p-6 flex items-center gap-4">
          <Loader2 className="w-5 h-5  animate-spin shrink-0" />
          <div>
            <p className="text-[13px]  font-medium">
              Judge sedang menganalisis kode…
            </p>
            <p className="text-[11px] mt-0.5">
              openai/gpt-oss-120b membaca diff dan mengevaluasi ringkasan
            </p>
          </div>
        </div>
      )}

      {/* ── Panel 4: Results ────────────────────────────────────────────────── */}
      {evalResult && !evalLoading && (
        <div ref={resultRef} className="border rounded-xl  overflow-hidden">
          <div className="px-5 py-3 border-b  flex items-center gap-2">
            <CheckCheck className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="text-[12px] font-semibold uppercase tracking-wider">
              Hasil Evaluasi
            </span>
            <span className="ml-auto text-[10px] font-mono text-[#1f2937]">
              {evalResult.model}
            </span>
          </div>

          {/* Overall score */}
          <div className="px-5 pt-5 pb-4 border-b  flex items-center justify-between">
            <div>
              <p className="text-[11px]  uppercase tracking-wider mb-1">
                Overall
              </p>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-[42px] font-bold leading-none tabular-nums"
                  style={{ color: grade(evalResult.overall).color }}
                >
                  {evalResult.overall}
                </span>
                <span className="text-[16px]">/5</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              {[
                { l: "Relevansi", s: evalResult.relevance.score },
                { l: "Kebenaran", s: evalResult.accuracy.score },
                { l: "Kelengkapan", s: evalResult.completeness.score },
              ].map(({ l, s }) => (
                <div key={l} className="flex items-center gap-2 justify-end">
                  <span className="text-[11px] ">{l}</span>
                  <span
                    className="text-[12px] font-semibold tabular-nums"
                    style={{ color: grade(s).color }}
                  >
                    {s}/5
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Score breakdown */}
          <div className="px-5">
            <ScoreRow label="Relevansi" aspect={evalResult.relevance} />
            <ScoreRow label="Kebenaran" aspect={evalResult.accuracy} />
            <ScoreRow label="Kelengkapan" aspect={evalResult.completeness} />
          </div>

          {/* Feedback */}
          <div className="px-5 pb-5">
            <div className="rounded-lg p-4">
              <p className="text-[11px]  uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CircleAlert className="w-3 h-3" /> Feedback Judge
              </p>
              <p className="text-[13px]  leading-relaxed">
                {evalResult.feedback}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
