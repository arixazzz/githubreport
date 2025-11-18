import RolesForm from "@/components/sections/roles/form";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import React from "react";

export const access = {
  permissions: ["read:User_Management", "write:User_Management"],
};

export default function Page() {
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
            title: "Tambah Role",
          },
        ]}
      />
      <RolesForm mode="create" />
    </main>
  );
}
