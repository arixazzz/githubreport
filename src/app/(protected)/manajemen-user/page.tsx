"use client";

import { useGetProduct } from "@/components/parts/admin/api";
import { productColumns } from "@/components/parts/admin/column";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { TableProvider } from "@/components/table";
import DataTable from "@/components/table/dataTable";
import TableBar from "@/components/table/tableBar";
import { Card } from "@/components/ui/card";
import TitleHeader from "@/components/shared/title";
import {
  dummyUser,
  ManajemenUserColumns,
} from "@/components/parts/manajemen-user/column";
import { FilterTextInput } from "@/components/filters";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const access: AccessRule = {
  permissions: [""],
  roles: [""],
};

export default function ProductPage() {
  const { data: _product } = useGetProduct();
  const product = _product?.data ?? [];

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
        data={dummyUser}
        displayItems
        displayPageSize
      />
    </Card>
  );
}
