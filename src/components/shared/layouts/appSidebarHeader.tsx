"use client";

import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";

export default function AppSidebarHeader() {
  const { open } = useSidebar();
  return (
    <div className="flex items-center gap-3 px-2 py-2 !p-5 justify-center">
      <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Image
          src="/assets/icons/logo.png?height=32&width=32"
          alt="Logo"
          width={open ? 40 : 30}
          height={open ? 40 : 30}
        />
      </div>
      {open && (
        <div className="flex flex-col text-primary">
          <p className="font-semibold text-sidebar-foreground">GitRepo</p>
          <p className="font-semibold text-sidebar-foreground">Platform</p>
        </div>
      )}
    </div>
  );
}
