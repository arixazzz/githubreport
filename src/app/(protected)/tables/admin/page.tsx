"use client";

import { useGetProduct } from "@/components/parts/admin/api";
import { productColumns } from "@/components/parts/admin/column";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { TableProvider } from "@/components/table";
import DataTable from "@/components/table/dataTable";
import TableBar from "@/components/table/tableBar";
import { Card } from "@/components/ui/card";

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
            title: "Produk",
          },
        ]}
      />
      <h1 className="text-2xl font-bold mb-4">Daftar Produk</h1>
      <TableProvider>
        <TableBar
          filterKeys={["filterName"]}
          filterItems={["date", "kolom"]}
          buttonAdd={{ label: "Tambah", href: "/tables/admin/create" }}
        >
          <DataTable
            columns={productColumns}
            data={product}
            displayItems
            displayPageSize
          />
        </TableBar>
      </TableProvider>
    </Card>
  );
}
