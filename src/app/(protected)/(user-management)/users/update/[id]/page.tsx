"use client";

import { useGetUsersDetail } from "@/components/parts/manajemen-user/users/api";
import UsersForm from "@/components/sections/users/form";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { useParams } from "next/navigation";

export const access = {
  permissions: ["read:User_Management", "update:User_Management"],
};

export default function Page() {
  const { id } = useParams();
  const { data } = useGetUsersDetail(Number(id));
  const DetailData = data?.data;
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
            title: "Perbaharui Pengguna",
          },
        ]}
      />
      <UsersForm
        mode="update"
        defaultValues={{
          address: DetailData?.address ?? "",
          email: DetailData?.email ?? "",
          gender: DetailData?.gender === "MALE" ? "MALE" : "FEMALE",
          name: DetailData?.name ?? "",
          nik: DetailData?.nik ?? "",
          password: "",
          phone: DetailData?.phone ?? "",
          pin: "",
          position: DetailData?.position ?? "",
          roleId: String(DetailData?.roleId),
          workUnit: DetailData?.workUnit ?? "",
          profilePicture: DetailData?.profilePicture ?? "",
        }}
      />
    </main>
  );
}
