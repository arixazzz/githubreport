"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type ResendTimerProps = {
  initialSeconds?: number;
  onResend: () => Promise<void> | void;
};

export default function ResendTimer({
  initialSeconds = 30,
  onResend,
}: ResendTimerProps) {
  const [seconds, setSeconds] = React.useState(initialSeconds);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const handleResend = async () => {
    setLoading(true);
    try {
      await onResend();
      setSeconds(initialSeconds);
    } finally {
      setLoading(false);
    }
  };

  const disabled = seconds > 0 || loading;

  return (
    <div className="flex items-center justify-center">
      <Button
        type="button"
        variant="ghost"
        onClick={handleResend}
        disabled={disabled}
        className="text-sm"
      >
        {disabled ? `Kirim ulang dalam ${seconds}s` : "Kirim ulang kode"}
      </Button>
    </div>
  );
}
