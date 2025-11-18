"use client";

import { useEffect, useState, useRef } from "react";

type NetworkState = {
  online: boolean;
  effectiveType?: string; // 4g, 3g, 2g, slow-2g
  downlink?: number; // Mbps
  rtt?: number; // ms
  unstable: boolean;
  status: "online" | "offline" | "slow" | "unstable";
};

export function useNetworkStatus() {
  const [state, setState] = useState<NetworkState>({
    online: typeof navigator !== "undefined" ? navigator.onLine : true,
    effectiveType: undefined,
    downlink: undefined,
    rtt: undefined,
    unstable: false,
    status:
      typeof navigator !== "undefined" && navigator.onLine
        ? "online"
        : "offline",
  });

  const lastStatus = useRef<"online" | "offline">(
    typeof navigator !== "undefined" && navigator.onLine ? "online" : "offline"
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined")
      return;

    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    const updateConnectionInfo = () => {
      setState((prev) => {
        let status: NetworkState["status"] = "online";

        if (!navigator.onLine) {
          status = "offline";
        } else if (
          connection?.effectiveType?.includes("2g") ||
          connection?.effectiveType === "3g" ||
          (connection?.rtt ?? 0) > 500
        ) {
          status = "slow";
        }

        return {
          ...prev,
          online: navigator.onLine,
          effectiveType: connection?.effectiveType,
          downlink: connection?.downlink,
          rtt: connection?.rtt,
          status,
        };
      });
    };

    const handleOnline = () => {
      if (lastStatus.current === "offline") {
        setState((prev) => ({
          ...prev,
          unstable: true,
          status: "unstable",
          online: true,
        }));
        setTimeout(() => {
          setState((prev) => ({ ...prev, unstable: false, status: "online" }));
        }, 3000);
      }
      lastStatus.current = "online";
    };

    const handleOffline = () => {
      lastStatus.current = "offline";
      setState((prev) => ({ ...prev, online: false, status: "offline" }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    connection?.addEventListener?.("change", updateConnectionInfo);

    updateConnectionInfo();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      connection?.removeEventListener?.("change", updateConnectionInfo);
    };
  }, []);

  return state;
}
