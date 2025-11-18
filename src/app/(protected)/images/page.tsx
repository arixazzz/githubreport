"use client";

import { Image } from "@/image";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import React from "react";

export const access: AccessRule = {
  permissions: [""],
  roles: [""],
};

export default function Page() {
  return (
    <div className="p-4">
      <BreadcrumbSetItem
        items={[{ title: "Dashboard", href: "/dashboard" }, { title: "" }]}
      />

      <div className="grid grid-cols-4">
        <Image
          src={
            "https://images.unsplash.com/photo-1754045502217-f4622c7d8d99?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          width={300}
          height={300}
          alt="Dummy"
        />
        <Image
          src={
            "https://images.unsplash.com/photo-1756726270255-9689c64a49d1?q=80&w=3420&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          width={300}
          height={300}
          alt="Dummy"
        />
        <Image
          src={
            "https://images.unsplash.com/photo-1752968940222-ff81d4f3cd6d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          width={300}
          height={300}
          alt="Dummy"
        />
        <Image
          src={
            "https://images.unsplash.com/photo-1757317202611-5047086e9024?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          width={300}
          height={300}
          alt="Dummy"
        />
      </div>
    </div>
  );
}
