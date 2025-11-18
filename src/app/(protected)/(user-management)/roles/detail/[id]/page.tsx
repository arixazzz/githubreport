"use client";

import { useGetRolesDetail } from "@/components/parts/roles/api";
import RolesForm from "@/components/sections/roles/form";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import SwirlingEffectSpinner from "@/components/shared/swirlingEffectSpinner";
import { useParams } from "next/navigation";

export const access = {
  permissions: ["read:User_Management"],
};

export default function Page() {
  const { id } = useParams();
  const { data: _rolesDetailData, isLoading } = useGetRolesDetail(Number(id));
  const RolesDetailData = _rolesDetailData?.data;

  console.log(RolesDetailData);

  return (
    <main>
      <BreadcrumbSetItem
        items={[
          {
            title: "Manajemen Pengguna",
          },
          {
            title: "Roles",
            href: "/roles",
          },
          {
            title: "Detail Role",
          },
        ]}
      />
      {isLoading ? (
        <div className="w-full place-content-center place-items-center h-[50svh]">
          <SwirlingEffectSpinner />
        </div>
      ) : (
        RolesDetailData && (
          <RolesForm
            mode="view"
            defaultValues={{
              name: RolesDetailData?.name,
              permissions: RolesDetailData.rolePermissions?.map((perm) => ({
                id: perm.id,
                permissionId: perm.permission.id,
                canDelete: perm.canDelete,
                canRead: perm.canRead,
                canRestore: perm.canRestore,
                canUpdate: perm.canUpdate,
                canWrite: perm.canWrite,
              })),
            }}
          />
        )
      )}
    </main>
  );
}
