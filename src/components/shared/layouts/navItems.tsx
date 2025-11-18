"use client";

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { canAccess } from "@/lib/canAccsess";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { NavItem } from "@/types/interface";
import NavItemsLogout from "./navItemsLogout";

export function NavItems({
  items,
  userRoles = [],
  isLoading,
  userPermissions = [],
}: {
  items: NavItem[];
  userRoles?: string[];
  userPermissions?: string[];
  isLoading?: boolean;
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  const toggleOpen = (key: string) => {
    setOpenStates((prev) => {
      const isCurrentlyOpen = !!prev[key];
      const newState: Record<string, boolean> = {};
      if (!isCurrentlyOpen) {
        newState[key] = true; // hanya buka dropdown yang diklik
      }
      return newState;
    });
  };

  const authorizedItems = items.filter((item) =>
    canAccess(item.url, userRoles, userPermissions)
  );

  if (isLoading || !authorizedItems) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          {[...Array(4)].map((_, idx) => (
            <SidebarMenuItem key={idx}>
              <SidebarMenuButton className="animate-pulse">
                <div className="w-7 h-5 bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-300 rounded ml-2" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  const isSubRouteActive = (pathname: string, base: string) =>
    pathname === base || pathname.startsWith(base + "/");

  return (
    <SidebarGroup>
      <SidebarMenu className="flex flex-col gap-2">
        {authorizedItems.map((item) => {
          const hasSubItems = item.items && item.items.length > 0;
          const normalizedUrl = item.url.startsWith("/")
            ? item.url
            : `/${item.url}`;

          const authorizedSubItems = item.items?.filter((subItem) => {
            if (!subItem.roles || subItem.roles.length === 0) return true;
            return subItem.roles.some((role) => userRoles.includes(role));
          });

          const shouldRenderDirectLink = item.directLinkRoles?.some((role) =>
            userRoles.includes(role)
          );

          // ✅ Aktif hanya jika salah satu sub-menu URL cocok
          const isActive =
            item.items?.some((sub) => isSubRouteActive(pathname, sub.url)) ??
            false;

          const isOpen = openStates[item.title] ?? false;

          if (
            hasSubItems &&
            (!authorizedSubItems || authorizedSubItems.length === 0) &&
            !shouldRenderDirectLink
          ) {
            return null;
          }

          // 🔗 Jika tidak punya sub-menu atau punya akses langsung
          if (!hasSubItems || shouldRenderDirectLink) {
            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} passHref>
                  <SidebarMenuButton
                    className={`hover:pl-7 p-5 transition-all duration-200 ${
                      isSubRouteActive(pathname, normalizedUrl)
                        ? "text-white bg-primary font-medium hover:!bg-primary hover:!text-white"
                        : "text-[#2E2E2E] font-medium hover:text-[#2E2E2E]"
                    }`}
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon className="!size-[19px]" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          }

          // 🧩 Menu dengan dropdown
          return (
            <Collapsible
              key={item.title}
              open={isOpen}
              onOpenChange={() => toggleOpen(item.title)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    className={`transition-all hover:pl-7 p-5 duration-200  ${
                      isActive
                        ? "text-white bg-primary font-medium hover:!bg-primary hover:!text-white"
                        : "text-[#2E2E2E] font-medium hover:text-[#2E2E2E]"
                    }`}
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon className="!size-[19px]" />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <CollapsibleContent asChild forceMount>
                      <motion.div
                        key="dropdown"
                        className="overflow-hidden"
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <SidebarMenuSub className="pl-4 ml-0 flex flex-col gap-2 mt-2">
                          {authorizedSubItems?.map((subItem) => {
                            const isSubActive = isSubRouteActive(
                              pathname,
                              subItem.url
                            );
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <Link href={subItem.url}>
                                  <SidebarMenuSubButton
                                    asChild
                                    className={`hover:text-primary transition-all duration-300 pl-2 group/sub ${
                                      isSubActive
                                        ? "font-medium text-primary"
                                        : "text--[#2E2E2E]"
                                    }`}
                                  >
                                    <div className="flex gap-2">
                                      <div
                                        className={`w-2 mr-1 h-2 rounded-full group-hover/sub:bg-primary ${
                                          isSubActive
                                            ? "bg-primary"
                                            : "bg-[#2E2E2E]"
                                        }`}
                                      />
                                      <span>{subItem.title}</span>
                                    </div>
                                  </SidebarMenuSubButton>
                                </Link>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </motion.div>
                    </CollapsibleContent>
                  )}
                </AnimatePresence>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
