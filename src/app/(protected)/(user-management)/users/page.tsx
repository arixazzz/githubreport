"use client";

import { useGetUsers } from "@/components/parts/manajemen-user/users/api";
import { usersColumns } from "@/components/parts/users/column";
import UpdatePasswordAction from "@/components/sections/users/updatePasswordAction";
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

  const { data: _usersData, isLoading: isLoadingData } = useGetUsers(
    `useFor=verify&${params.toString()}`
  );
  const UsersData = _usersData?.data;
  return (
    <main>
      <BreadcrumbSetItem
        items={[
          {
            title: "Manajemen Pengguna",
          },
          {
            title: "Pengguna",
          },
        ]}
      />
      {/*  */}
      <div className="mt-5">
        <TableProvider>
          <TableBar
            title="Manajemen Pengguna"
            buttonAdd={{ label: "Tambah", href: "/users/create" }}
          >
            {isLoadingData ? (
              <div className="w-full place-content-center place-items-center h-[50svh]">
                <SwirlingEffectSpinner />
              </div>
            ) : (
              <DataTable
                columns={usersColumns}
                data={UsersData?.items ?? []}
                currentPage={UsersData?.current_page ?? 1}
                totalItems={UsersData?.total_items ?? 0}
                totalPages={UsersData?.total_pages ?? 1}
              />
            )}
          </TableBar>
        </TableProvider>
      </div>
      <UpdatePasswordAction />
    </main>
  );
}
