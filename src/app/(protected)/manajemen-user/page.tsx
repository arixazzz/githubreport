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
  permissions: [""],
  roles: [""],
};

export default function ProductPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/manajemen-user/api/get", {
          method: "GET",
        });

        const json = await res.json();
        setData(json.users);
      } catch (error) {
        console.error("Gagal fetch data user:", error);
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

      <DataTable
        columns={ManajemenUserColumns}
        data={data}
        displayItems
        displayPageSize
      />
    </Card>
  );
}
