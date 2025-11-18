"use client";

import { useGetNotificationCount } from "@/components/parts/notification/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Link from "next/link";
import React from "react";
import AnimatedNumber from "@/components/shared/animateNumber";

export default function NotificationMenu() {
  const { data } = useGetNotificationCount();
  const count = data?.data.totalUnRead;
  return (
    <Link href={`/notification`}>
      <Button
        variant={"ghost"}
        className="relative !p-0 hover:bg-transparent group"
      >
        <Bell className="!size-6 md:!size-8 group-hover:rotate-3" />
        {count && count > 0 ? (
          <Badge className="absolute top-0 right-0 rounded-full !aspect-square !text-[0.4rem] md:!text-[0.6rem] size-4 md:size-5 p-0 items-center justify-center bg-red-500 hover:bg-red-600 !border-1 !border-red-200 !font-mono font-thin">
            <AnimatedNumber value={count ?? 0} />
          </Badge>
        ) : undefined}
      </Button>
    </Link>
  );
}
