"use client";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { CloudOff, TriangleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";

export default function NetInfo() {
  const net = useNetworkStatus();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      net.status === "slow" ||
      net.status === "unstable" ||
      net.status === "offline"
    ) {
      setOpen(true);
    }
  }, [net]);

  if (!open) return null;

  return (
    <div className="fixed right-6 bottom-6 z-50 flex items-center gap-3 min-w-72 h-16 px-3 py-2 rounded-xl bg-white/70 backdrop-blur-md shadow-lg border border-gray-200 animate-in slide-in-from-bottom fade-in">
      {/* Icon */}
      {net.status === "offline" ? (
        <CloudOff className="size-8 text-red-500 shrink-0" />
      ) : (
        <TriangleAlert className="size-8 text-yellow-500 shrink-0" />
      )}

      {/* Info */}
      <div className="flex-1">
        <p className="font-semibold capitalize">{net.status}</p>
        <p className="text-xs text-gray-600">Koneksi tidak stabil</p>
      </div>

      {/* RTT */}
      {net.rtt && net.rtt !== 0 && (
        <Badge variant="secondary" className="text-xs">
          {net.rtt} ms
        </Badge>
      )}

      {/* Tombol close */}
      <button
        onClick={() => setOpen(false)}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
