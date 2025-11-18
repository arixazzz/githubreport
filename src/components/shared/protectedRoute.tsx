"use client";

import useGetToken from "@/hooks/useGetToken";
import { canAccess } from "@/lib/canAccsess";
import { unauthorized, usePathname } from "next/navigation";
import React, { Suspense, useMemo } from "react";
import SwirlingEffectSpinner from "./swirlingEffectSpinner";
import { usePermission } from "@/hooks/useGetPermission";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const { decode } = useGetToken();
  const { isLoading, permissions } = usePermission();
  const isPermission = useMemo(() => {
    // 🔹 Auto allow kalau development mode
    if (process.env.NEXT_PUBLIC_MODE === "UI") {
      return true;
    }
    return (
      decode?.role &&
      permissions &&
      canAccess(path, [decode?.role], permissions)
    );
  }, [decode?.role, path, permissions]);

  if (isLoading)
    return (
      <div className="w-[100wh] h-[80vh] flex justify-center items-center">
        <SwirlingEffectSpinner />
      </div>
    );
  if (isPermission) return <Suspense>{children}</Suspense>;

  if (!isPermission && !isLoading) unauthorized();
}
