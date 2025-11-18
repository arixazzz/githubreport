"use client";

import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";

export default function AppSidebarHeader() {
  const { open } = useSidebar();
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <Image
          src="/assets/icons/logo.svg?height=62&width=62"
          alt="Logo"
          width={open ? 70 : 30}
          height={open ? 70 : 30}
        />
      </div>
      {open && (
        <div className="flex flex-col">
          <p className="font-semibold text-sidebar-foreground">Maincore</p>
          <p className="text-xs text-sidebar-foreground/70">
            Maincore newus project x
          </p>
        </div>
      )}
    </div>
  );
}
