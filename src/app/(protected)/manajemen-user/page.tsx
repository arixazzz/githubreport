"use client";

import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Card } from "@/components/ui/card";
import TitleHeader from "@/components/shared/title";
import { FilterTextInput } from "@/components/filters";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import DataTable from "@/components/table/dataTable";
import { ManajemenUserColumns } from "@/components/parts/manajemen-user/column";

export const access: AccessRule = {
  roles: ["ADMIN"],
};

export default function ManajemenUserPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/users/get", {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        setData(json.users || []);
      } catch (error) {
        console.error("Gagal fetch data user:", error);
        setError(error instanceof Error ? error.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <Card className="p-4">
      <BreadcrumbSetItem
        items={[
          {
            title: "Manajemen User",
          },
        ]}
      />
      <TitleHeader title="Manajemen User" />

      <div className="flex gap-3 mb-4">
        <FilterTextInput
          placeholder="Cari"
          name="search"
          prefixIcon={<Search size={20} color="#473D3D" />}
        />
        <Link href={"/manajemen-user/create"}>
          <Button className="rounded-full">Tambah User</Button>
        </Link>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-500">
          Memuat data user...
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-600 bg-red-50 rounded-md border border-red-200">
          Error: {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Belum ada data user.
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <DataTable
          columns={ManajemenUserColumns}
          data={data}
          displayItems
          displayPageSize
        />
      )}
    </Card>
  );
}
