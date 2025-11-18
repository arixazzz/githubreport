"use client";

import * as React from "react";
import { InputMask } from "@react-input/mask";
import { cn } from "@/lib/utils";

type MaskedInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  mask: string;
  className?: string;
  replacement?: { [key: string]: RegExp };
};

export const CustomMaskedInput = React.forwardRef<
  HTMLInputElement,
  MaskedInputProps
>(({ className, replacement, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // gabung dengan ref dari luar
  React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Cursor ke awal
    const el = e.target;
    setTimeout(() => {
      if (el.setSelectionRange) {
        el.setSelectionRange(0, 0);
      }
    }, 0);
  };

  return (
    <InputMask
      {...props}
      ref={inputRef}
      onFocus={handleFocus}
      replacement={replacement ?? { _: /\d/ }}
      className={cn(
        "border-0 shadow-none focus-visible:ring-0 focus-visible:outline-none p-0",
        className
      )}
      showMask
    />
  );
});

CustomMaskedInput.displayName = "CustomMaskedInput";
