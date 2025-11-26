"use client";

import { Filter } from "@/components/filters";
import NavMenu from "@/components/shared/layouts/admin/navMenu";
import { AppSidebar } from "@/components/shared/layouts/appSidebar";
import { MyBreadcrumb } from "@/components/shared/layouts/myBreadcrumb";
import SidebarButtonTrigger from "@/components/shared/layouts/sidebarButtonTrigger";
import SocketNotificationCustom from "@/components/shared/notification";
import ProtectedRoute from "@/components/shared/protectedRoute";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";

const WebPushWarper = dynamic(
  () => import("@/components/shared/webPushWarper"),
  {
    ssr: false,
  }
);

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // <WebPushWarper>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className=" z-10 flex h-16 shrink-0 items-center gap-2 shadow-md px-4 bg-white sticky top-0">
          <SidebarButtonTrigger />
          <MyBreadcrumb />
          <NavMenu />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 bg-[#F9FAFB]">
          <Filter>
            <ProtectedRoute>{children}</ProtectedRoute>
          </Filter>
        </div>
      </SidebarInset>
    </SidebarProvider>
    // </WebPushWarper>
  );
}
