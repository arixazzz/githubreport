"use client";

import { logActivityColumns } from "@/components/parts/log-activity/column";
import DataTable from "@/components/table/dataTable";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Interface for the LogActivity model
export interface LogActivity {
  id: number;
  userId: number;
  activity: string;
  timestamp: Date;
  user: {
    id: number;
    nama: string;
    usernamegithub: string;
    role: "USER" | "ADMIN";
  };
}

export default function Page() {
  const [data, setData] = useState<LogActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (start) params.append("startDate", start);
      if (end) params.append("endDate", end);

      const queryString = params.toString();
      const url = `/api/log-aktivitas/get${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      setData(json.log || []);
    } catch (error) {
      console.error("Gagal fetch data log aktivitas:", error);
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    fetchData(startDate, endDate);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    fetchData();
  };

  return (
    <main>
      <BreadcrumbSetItem
        items={[
          {
            title: "Log Aktivitas",
          },
        ]}
      />

      {/* Filter Section */}
      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-lg">Filter Berdasarkan Tanggal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Pilih tanggal mulai"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Akhir</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Pilih tanggal akhir"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFilter} className="flex-1">
                Filter
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table Section */}
      <Card className="mt-5">
        <CardContent className="mt-8">
          {loading && (
            <div className="text-center py-8 text-gray-500">Memuat data...</div>
          )}

          {error && (
            <div className="text-center py-8 text-red-600 bg-red-50 rounded-md border border-red-200">
              Error: {error}
            </div>
          )}

          {!loading && !error && data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada data aktivitas.
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <DataTable columns={logActivityColumns} data={data} />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
