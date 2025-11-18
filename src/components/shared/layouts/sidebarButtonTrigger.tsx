"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import { Menu } from "lucide-react";

export default function SidebarButtonTrigger() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  if (isMobile)
    return (
      <Button onClick={toggleSidebar} className="!p-1 !h-auto">
        <Menu className="h-4 w-4" />
      </Button>
    );
}
