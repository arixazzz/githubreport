"use client";

import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getNavData } from "@/constants";
import { usePermission } from "@/hooks/useGetPermission";
import useGetToken from "@/hooks/useGetToken";
import AppSidebarHeader from "./appSidebarHeader";
import { NavItems } from "./navItems";
import NavItemsLogout from "./navItemsLogout";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navData = getNavData();
  const { permissions, isLoading } = usePermission();
  const { decode } = useGetToken();

  // Default values lebih aman
  const userRole = decode?.role ? [decode.role] : ["GUEST"];
  const navItems = navData?.navItems ?? [];

  return (
    <Sidebar collapsible="icon" {...props} className="z-20">
      <SidebarHeader className="p-0 sticky top-0 bg-white z-10">
        <AppSidebarHeader />
      </SidebarHeader>

      <SidebarContent className="bg-white">
        {!isLoading && navItems.length > 0 && (
          <NavItems
            items={navItems}
            userRoles={userRole}
            isLoading={isLoading}
            userPermissions={permissions ?? []}
          />
        )}
      </SidebarContent>

      {/* Logout */}
      <NavItemsLogout />

      {/* Optional Rail */}
      <SidebarRail />
    </Sidebar>
  );
}
