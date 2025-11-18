"use client";

import { ensureWebPushSubscription } from "@/components/parts/webpush/api";
import { myAlert } from "@/lib/myAlert";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { useCallback, useEffect, useState } from "react";

export function useWebPush(autoSubscribe = false) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" ? Notification.permission : "default"
  );

  const subscribe = useCallback(async () => {
    setLoading(true);
    try {
      const sub = await ensureWebPushSubscription();
      setSubscription(sub);
      setPermission(Notification.permission);
      return sub;
    } catch (e: any) {
      if (e.status === 401) {
        Cookies.remove("accessToken"); // "token" adalah nama cookies Anda
        router.push("/login");
      }
      myAlert.error(
        "Perizinan Gagal",
        e?.message ?? "Gagal melakukan notifikasi"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // auto-subscribe kalau di layout protected
  useEffect(() => {
    if (autoSubscribe && permission !== "granted") {
      subscribe();
    }
  }, [autoSubscribe, permission, subscribe]);

  return { subscribe, loading, subscription, permission };
}
