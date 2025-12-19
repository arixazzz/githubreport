"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";

// interface DashboardData defined locally to match API response
interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  totalUsers: number;
  recentActivities: {
    id: number;
    activity: string;
    timestamp: string;
    user: {
      nama: string;
      usernamegithub: string;
    };
  }[];
  recentReports: {
    id: number;
    createdAt: string;
    project: {
      title: string;
      githubRepo: string;
    };
    user: {
      nama: string;
      usernamegithub: string;
    };
  }[];
}

export const access: AccessRule = {
  roles: ["ADMIN", "USER"],
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/get", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text);
            throw new Error(json.error || json.message || "Failed fetch");
          } catch {
            throw new Error(text || `Error ${res.status}: ${res.statusText}`);
          }
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-8">
      <BreadcrumbSetItem items={[{ title: "Dashboard" }]} />

      {loading && <div className="p-6">Loading dashboard data...</div>}

      {error && (
        <div className="p-6 bg-red-50 text-red-600 border border-red-200 rounded-md">
          Error: {error}
        </div>
      )}

      {!loading && !error && !data && (
        <div className="p-6">Tidak ada data dashboard</div>
      )}

      {!loading && !error && data && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Total Project
              </h3>
              <p className="text-3xl font-bold mt-2">{data.totalProjects}</p>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500">
                Project Aktif
              </h3>
              <p className="text-3xl font-bold mt-2 text-green-600">
                {data.activeProjects}
              </p>
            </Card>

            <Card className="p-6 hover:shadow-md transition-shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-3xl font-bold mt-2">{data.totalUsers}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activities */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Aktivitas Terbaru</h3>
              <div className="space-y-4">
                {data.recentActivities.length === 0 ? (
                  <p className="text-gray-500 text-sm">Belum ada aktivitas.</p>
                ) : (
                  data.recentActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="border-b last:border-0 pb-3 last:pb-0"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user?.nama || "Unknown User"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {activity.activity}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Recent Reports */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Laporan Terbaru</h3>
              <div className="space-y-4">
                {data.recentReports.length === 0 ? (
                  <p className="text-gray-500 text-sm">Belum ada laporan.</p>
                ) : (
                  data.recentReports.map((report, idx) => (
                    <div
                      key={idx}
                      className="border-b last:border-0 pb-3 last:pb-0"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {report.project?.title || "No Project"}
                      </p>
                      <p className="text-xs text-blue-600 mb-1">
                        {report.project?.githubRepo}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          Oleh: {report.user?.nama}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
