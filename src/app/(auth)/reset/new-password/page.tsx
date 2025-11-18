"use client";

import { useResetPasswordMutation } from "@/components/parts/login/api";
import {
  ResetPasswordPayload,
  resetPasswordValidation,
} from "@/components/parts/login/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomFormInput } from "@/components/shared/forms/customFormInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import SwirlingEffectSpinner from "@/components/shared/swirlingEffectSpinner";
import { useEffect } from "react";

export default function Page() {
  const tokenReset = Cookie.get("token-reset");
  const router = useRouter();

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordValidation),
  });

  const resetPasswordMutation = useResetPasswordMutation(tokenReset);

  const onSubmit = (data: ResetPasswordPayload) => {
    resetPasswordMutation.mutate(data, {
      onSuccess: () => {
        Cookie.remove("reset-password-mail");
        router.replace("/login");
      },
    });
  };

  useEffect(() => {
    if (!tokenReset) {
      router.replace(`/login`);
    }
  }, [router, tokenReset]);

  if (!tokenReset)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <SwirlingEffectSpinner />
      </div>
    );

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-balance">Masukan Password Baru</CardTitle>
          <CardDescription className="text-pretty">
            Masukkan password baru kamu dan login lagi setelah password
            diperbaharui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-5">
                <CustomFormInput<ResetPasswordPayload>
                  name="newPassword"
                  label="Password Baru"
                />
                <CustomFormInput<ResetPasswordPayload>
                  name="confirmPassword"
                  label="Konfirmasi Password Baru"
                />
              </div>
              <div className="mt-5 flex justify-end">
                <Button className="rounded-full w-40">Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
