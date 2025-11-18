import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Label } from "../ui/label";

const valueLabelVariants = cva(
  "line-clamp-1 overflow-hidden", // base
  {
    variants: {
      variant: {
        default: "text-start text-base w-full",
        input:
          "border rounded-full h-10 flex items-center text-sm px-4 w-full data-[disabled=true]:bg-text-700/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ValueLabelProps
  extends VariantProps<typeof valueLabelVariants> {
  label?: string;
  value?: React.ReactNode;
  valueClassName?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal" | "between"; // 🔑 tambah between
  required?: boolean;
}

export default function ValueLabel({
  value,
  label,
  labelClassName,
  valueClassName,
  className,
  variant,
  disabled = false,
  orientation = "vertical",
  required = false,
}: ValueLabelProps) {
  const isString = typeof value === "string" || typeof value === "number";
  const isElement = React.isValidElement(value);
  const isEmpty = value === undefined || value === null;

  const isHorizontal = orientation === "horizontal";
  const isBetween = orientation === "between";

  return (
    <div
      className={cn(
        "w-full",
        orientation === "vertical" && "flex flex-col gap-y-2",
        isHorizontal && "flex flex-row items-center gap-x-4",
        isBetween && "flex flex-row justify-between items-center gap-x-4",
        className
      )}
    >
      {label && (
        <Label
          className={cn(
            "text-muted-foreground",
            isHorizontal ? "shrink-0 w-32" : "",
            isBetween ? "flex-1" : "",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      {isEmpty ? (
        <div className={cn("w-full rounded-full bg-slate-200 animate-pulse")} />
      ) : isString ? (
        <p
          aria-disabled={disabled}
          data-disabled={disabled}
          className={cn(
            valueLabelVariants({ variant }),
            isBetween ? "text-end flex-1" : "",
            valueClassName
          )}
        >
          {value as React.ReactNode}
        </p>
      ) : isElement ? (
        React.cloneElement(value as React.ReactElement, {
          className: cn(
            (value as any)?.props?.className,
            isBetween ? "flex-1 text-end" : ""
          ),
          "data-disabled": disabled ? "true" : undefined,
          "aria-disabled": disabled || undefined,
        })
      ) : null}
    </div>
  );
}
