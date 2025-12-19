"use client";

// import useGetToken from "@/hooks/useGetToken";
import { canAccess } from "@/lib/canAccsess";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useMemo, useEffect } from "react";
import SwirlingEffectSpinner from "./swirlingEffectSpinner";
import { usePermission } from "@/hooks/useGetPermission";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  // const { decode } = useGetToken(); // ❌ Cannot use httpOnly cookie
  const { isLoading, permissions, roles } = usePermission();

  const isPermission = useMemo(() => {
    // 🔹 Auto allow kalau development mode
    if (process.env.NEXT_PUBLIC_MODE === "UI") return true;

    return roles && roles.length > 0 && canAccess(path, roles, permissions);
  }, [roles, path, permissions]);

  // 🔹 Redirect manual kalau tidak punya akses
  useEffect(() => {
    if (!isLoading && !isPermission) {
      router.replace("/login"); // atau halaman lain sesuai kebutuhan
    }
  }, [isLoading, isPermission, router]);

  if (isLoading)
    return (
      <div className="w-[100vw] h-[80vh] flex justify-center items-center">
        <SwirlingEffectSpinner />
      </div>
    );

  if (isPermission) return <Suspense>{children}</Suspense>;

  // Kalau belum redirect, tampil loading
  return null;
}
