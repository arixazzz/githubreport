import UsersForm from "@/components/sections/users/form";
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
            title: "Pengguna",
            href: "/users",
          },
          {
            title: "Tambah Pengguna",
          },
        ]}
      />
      <UsersForm mode="create" />
    </main>
  );
}
