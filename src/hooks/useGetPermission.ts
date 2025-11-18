import { useGetUserDetail } from "@/components/parts/users/api";
import Cookies from "js-cookie";
import { useCallback, useMemo } from "react";

export function usePermission() {
  const { data, isLoading, error } = useGetUserDetail();

  if (error?.status === 401) {
    Cookies.remove("accessToken");
    // ensureWebPushSubscription();
  }

  // 1️⃣ memoize permissions array
  const permissions: string[] = useMemo(
    () => data?.data?.role?.rolePermissions ?? [],
    [data]
  );

  // 2️⃣ memoize can function
  const can = useCallback(
    (required: string | string[], mode: "all" | "some" = "all") => {
      const requiredArray = Array.isArray(required) ? required : [required];
      if (mode === "all") {
        return requiredArray.every((perm) => permissions.includes(perm));
      }
      return requiredArray.some((perm) => permissions.includes(perm));
    },
    [permissions]
  );

  return { can, isLoading, permissions };
}
