"use client";

import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Project {
  id: number;
  title: string;
  detail: string;
  deadline: string;
  stack: string;
  githubOwner: string;
  githubRepo: string;
  visibility: "PUBLIC" | "PRIVATE";
  developers: {
    user: {
      nama: string;
      usernamegithub: string;
      role: string;
      position: string;
    };
  }[];
}

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [data, setData] = useState<Project | null>(null);
  const [load, setLoad] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErr("Project ID not found");
      setLoad(false);
      return;
    }

    const fetchData = async (id: number) => {
      setLoad(true);
      try {
        const res = await fetch(`/api/project/get/${id}`);
        const data = await res.json();
        if (data.project) {
          setData(data.project);
        } else {
          setErr("Project not found");
        }
        setLoad(false);
      } catch (error) {
        setErr("An error occurred while fetching project details");
        setLoad(false);
      }
    };
    fetchData(Number(id));
  }, [id]);

  if (load) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm text-gray-500">Memuat detail project...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-center text-red-600">
          <p className="font-semibold">Terjadi Kesalahan</p>
          <p className="text-sm">{err}</p>
          <Link href="/listing-project">
            <Button variant="outline" className="mt-4 border-red-200 bg-white">
              Kembali
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p>Project tidak ditemukan</p>
      </div>
    );
  }

  const formattedDeadline = new Date(data.deadline).toLocaleDateString(
    "id-ID",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="space-y-6">
      <BreadcrumbSetItem
        items={[
          {
            title: "Listing Project",
          },
          {
            title: "Listing Project",
            href: "/listing-project",
          },
          {
            title: "Detail",
          },
        ]}
      />

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] px-2 py-1 rounded-full font-semibold border ${
                data.visibility === "PRIVATE"
                  ? "bg-red-500/20 border-red-400 text-white"
                  : "bg-green-500/20 border-green-400 text-white"
              }`}
            >
              {data.visibility}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h1>
          <p className="mt-2 text-blue-100 opacity-90">
            Project ID: #{data.id}
          </p>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content Info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card className="p-6 shadow-sm border-0 ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                📄
              </span>
              Deskripsi Detail
            </h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <p className="whitespace-pre-line leading-relaxed">
                {data.detail}
              </p>
            </div>
          </Card>

          {/* Developers */}
          <Card className="p-6 shadow-sm border-0 ring-1 ring-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                👥
              </span>
              Team Developer
            </h2>
            {data.developers && data.developers.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.developers.map((dev, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                      {dev.user.nama.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {dev.user.nama}
                      </p>
                      <p className="text-xs text-gray-500">
                        {dev.user.position || "Developer"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-700">
                Belum ada developer assigned ke project ini.
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Meta Info Card */}
          <Card className="divide-y divide-gray-100 shadow-sm border-0 ring-1 ring-gray-200">
            {/* Owner / Repo */}
            <div className="p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Repository
              </p>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded-md">
                  <svg
                    height="20"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                    ></path>
                  </svg>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {data.githubRepo}
                  </span>
                  <span className="text-xs text-gray-500">
                    {data.githubOwner}
                  </span>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {data.stack ? (
                  data.stack.split(",").map((tech, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                    >
                      {tech.trim()}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div className="p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Deadline
              </p>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-lg">🗓️</span>
                <span className="text-sm font-medium">{formattedDeadline}</span>
              </div>
            </div>

            {/* Link */}
            <div className="p-4 bg-gray-50">
              <Link
                href={`https://github.com/${data.githubOwner}/${data.githubRepo}`}
                target="_blank"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                Buka Repository
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          </Card>

          <Link href="/listing-project" className="block">
            <Button
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-900"
            >
              ← Kembali ke Listing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
