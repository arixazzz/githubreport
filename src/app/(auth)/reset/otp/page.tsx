"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect } from "react";
import Cookie from "js-cookie";
import FormOtp from "@/components/sections/reset-password/formOtp";
import { useRouter } from "next/navigation";
import SwirlingEffectSpinner from "@/components/shared/swirlingEffectSpinner";

export default function Page() {
  const router = useRouter();
  const identifier = Cookie.get("reset-password-mail");

  useEffect(() => {
    if (!identifier) {
      router.replace(`/login`);
    }
  }, [router, identifier]);

  if (!identifier)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <SwirlingEffectSpinner />
      </div>
    );

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-balance">Verifikasi Kode OTP</CardTitle>
          <CardDescription className="text-pretty">
            Masukkan 6 digit kode yang kami kirim ke {identifier}. Periksa
            folder spam jika belum menerima.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormOtp identifier={identifier} length={6} />
        </CardContent>
      </Card>
    </main>
  );
}
