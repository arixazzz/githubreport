"use client";

import { useLogoutMutation } from "@/components/parts/login/api";
import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";
import { myAlert } from "@/lib/myAlert";
import { LogOut } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function NavItemsLogout() {
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const logout = () => {
    myAlert
      .confirm("Keluar", "Yakin ingin keluar", "keluar")
      .then(async (res) => {
        if (res) {
          Cookies.remove("accessToken"); // "token" adalah nama cookies Anda
          router.push("/login");
        }
      });
  };
  return (
    <SidebarFooter className="mb-20">
      <Button
        className={`hover:pl-7 p-5 transition-all duration-200 bg-red-600 text-white hover:bg-red-700 hover:text-white justify-start`}
        onClick={logout}
      >
        <LogOut />
        Keluar
      </Button>
    </SidebarFooter>
  );
}
