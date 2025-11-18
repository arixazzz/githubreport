"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/store/userStore";
import Link from "next/link";
import NotificationMenu from "./notificationMenu";

export default function NavMenu() {
  const { user } = useProfile();
  return (
    <div className="ml-auto flex items-center gap-x-3 md:gap-x-6">
      <NotificationMenu />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex gap-x-4 text-sm md:text-base">
          <div className="font-semibold text-end">
            <p className="line-clamp-1">{user?.name ?? "User"}</p>
            <p className="font-normal text-sm line-clamp-1">
              {user?.role?.name ?? "Villager"}
            </p>
          </div>
          <Avatar>
            <AvatarImage
              src={user?.profilePicture ?? "https://github.com/shadcn.png"}
              className="object-cover"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[20svh] mt-3">
          <DropdownMenuItem className="flex gap-x-4 justify-end">
            <div className="font-semibold text-end">
              <p className="line-clamp-1">{user?.name ?? "User"}</p>
              <p className="font-normal text-sm">
                {user?.role?.name ?? "Villager"}
              </p>
            </div>
            <Avatar>
              <AvatarImage
                src={user?.profilePicture ?? "https://github.com/shadcn.png"}
                className="object-cover"
              />
              <AvatarFallback>{user?.name}</AvatarFallback>
            </Avatar>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Link href={`/profile`}>
            <DropdownMenuItem>Profil</DropdownMenuItem>
          </Link>
          <Link href={`/log-activity`}>
            <DropdownMenuItem>Log Aktivitas</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
