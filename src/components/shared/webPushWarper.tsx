"use client";

import { useWebPush } from "@/hooks/useWebPush";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Bell, BellRing, Shield, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function WebPushWarper({
  children,
}: {
  children?: React.ReactNode;
}) {
  const { subscribe, loading, permission } = useWebPush();

  // kontrol modal manual
  const [open, setOpen] = useState(
    !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && permission !== "granted"
  );

  // kalau sudah granted, render child biasa
  if (permission === "granted") {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      {/* Floating button pojok kanan bawah */}
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(true)}
          className="rounded-full shadow-lg"
        >
          <Bell className="w-5 h-5" />
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          {permission === "default" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-primary" />
                  Aktifkan Notifikasi
                </DialogTitle>
                <DialogDescription>
                  Supaya selalu update berita & info penting langsung di device
                  kamu.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>Dapatkan update real-time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>Informasi penting dan pengingat</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Privasi Anda terjamin. Kami hanya kirim notifikasi relevan
                    dan tidak membagikan data Anda.
                  </span>
                </div>

                <Button
                  onClick={subscribe}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin"></div>
                      Meminta izin...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Aktifkan Notifikasi
                    </div>
                  )}
                </Button>
              </div>
            </>
          )}

          {permission === "denied" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <X className="w-5 h-5" />
                  Notifikasi Diblokir
                </DialogTitle>
                <DialogDescription>
                  Untuk dapat update terbaru, silakan aktifkan notifikasi
                  melalui pengaturan browser.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="bg-muted/50 p-3 rounded-lg text-sm">
                  <p className="font-semibold mb-1">Cara mengaktifkan:</p>
                  <ol className="list-decimal list-inside text-xs space-y-1 text-muted-foreground">
                    <li>Klik ikon gembok di address bar</li>
                    <li>Pilih &quot;Izinkan&quot; untuk Notifikasi</li>
                    <li>Refresh halaman ini</li>
                  </ol>
                </div>

                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full"
                >
                  Refresh Halaman
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
