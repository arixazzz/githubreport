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
  return (
    <Sidebar collapsible="icon" {...props} className="z-20">
      <SidebarHeader className="p-0 sticky bg-white">
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        {navData && (
          <NavItems
            items={navData.navItems}
            userRoles={[decode?.role ?? ""]}
            isLoading={isLoading}
            userPermissions={permissions ?? []}
          />
        )}
      </SidebarContent>
      <NavItemsLogout />
      <SidebarRail />
    </Sidebar>
  );
}
