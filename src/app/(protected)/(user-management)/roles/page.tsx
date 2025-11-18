"use client";

import { useGetRoles } from "@/components/parts/roles/api";
import { rolesColumns } from "@/components/parts/roles/column";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import SwirlingEffectSpinner from "@/components/shared/swirlingEffectSpinner";
import { TableProvider } from "@/components/table";
import DataTable from "@/components/table/dataTable";
import TableBar from "@/components/table/tableBar";
import { useSearchParams } from "next/navigation";

export const access = {
  permissions: ["read:User_Management"],
};

export default function Page() {
  const params = useSearchParams();
  const { data: _rolesData, isLoading: isLoadingData } = useGetRoles(
    params.toString()
  );
  const RolesData = _rolesData?.data;

  return (
    <main>
      <BreadcrumbSetItem
        items={[
          {
            title: "Manajemen Pengguna",
          },
          {
            title: "Role",
          },
        ]}
      />
      {/*  */}
      <div className="mt-5">
        <TableProvider>
          <TableBar
            title="Manajemen Role"
            buttonAdd={{ label: "Tambah", href: "/roles/create" }}
          >
            {isLoadingData ? (
              <div className="w-full place-content-center place-items-center h-[50svh]">
                <SwirlingEffectSpinner />
              </div>
            ) : (
              <DataTable
                columns={rolesColumns}
                data={RolesData?.items ?? []}
                currentPage={RolesData?.current_page ?? 1}
                totalItems={RolesData?.total_items ?? 0}
                totalPages={RolesData?.total_pages ?? 1}
              />
            )}
          </TableBar>
        </TableProvider>
      </div>
    </main>
  );
}
