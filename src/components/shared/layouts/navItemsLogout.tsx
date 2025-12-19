"use client";

import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";
import { myAlert } from "@/lib/myAlert";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavItemsLogout() {
  const router = useRouter();

  const logout = async () => {
    const confirm = await myAlert.confirm(
      "Keluar",
      "Yakin ingin keluar dari sistem?",
      "Keluar"
    );

    if (!confirm) return;

    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout gagal");
      }

      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      myAlert.error("Gagal logout, silakan coba lagi");
    }
  };

  return (
    <SidebarFooter className="mb-20">
      <Button
        onClick={logout}
        className="w-full justify-start gap-3 bg-red-600 hover:bg-red-700 text-white"
      >
        <LogOut size={18} />
        Keluar
      </Button>
    </SidebarFooter>
  );
}
