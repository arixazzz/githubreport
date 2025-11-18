"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import ResendTimer from "@/components/shared/reSendTimer";
import { cn } from "@/lib/utils";
import {
  useForgoutMutation,
  useVerificationOtpMutation,
} from "@/components/parts/login/api";
import { toast } from "@/lib/myToast";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";

type OtpFormProps = {
  identifier?: string; // email/phone (untuk info)
  length?: number;
};

export default function FormOtp({ identifier, length = 6 }: OtpFormProps) {
  const router = useRouter();
  const [otp, setOtp] = React.useState("");

  const isValid = otp.replace(/\D/g, "").length === length;

  const verificationMutation = useVerificationOtpMutation();
  const forgoutMutation = useForgoutMutation();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Kode belum lengkap", `Masukkan ${length} digit kode OTP.`);
      return;
    }
    verificationMutation.mutate(
      { otp: otp },
      {
        onSuccess: (response) => {
          Cookie.remove("reset-password-mail");
          Cookie.set("token-reset", response.data.token);
          router.push("/reset/new-password");
        },
      }
    );
  };

  const handleResend = () => {
    if (identifier) {
      forgoutMutation.mutate({ email: identifier });
    }
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <div className="grid gap-2">
        <label className="sr-only" htmlFor="otp">
          Kode OTP
        </label>
        <InputOTP
          value={otp}
          onChange={setOtp}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          className="w-full"
          disabled={verificationMutation.isPending}
          aria-label="Masukkan kode OTP"
        >
          <div className="flex w-full justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
              <InputOTPGroup key={i}>
                <InputOTPSlot
                  index={i}
                  className={cn(
                    "h-12 w-12 text-center font-medium tracking-widest",
                    "bg-card text-card-foreground",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "ring-offset-background"
                  )}
                />
              </InputOTPGroup>
            ))}
          </div>
        </InputOTP>
        <p className="text-muted-foreground text-sm text-center">
          {`Masukkan ${length} digit kode yang dikirim ke ${identifier ?? "akun Anda"}.`}
        </p>
      </div>

      <div className="grid gap-3">
        <Button
          type="submit"
          disabled={!isValid || verificationMutation.isPending}
          className="w-full"
        >
          {verificationMutation.isPending
            ? "Memverifikasi..."
            : "Verifikasi Kode"}
        </Button>

        <ResendTimer initialSeconds={30} onResend={handleResend} />
      </div>
    </form>
  );
}
