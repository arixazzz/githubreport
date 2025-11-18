"use client";

import { Input, InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React from "react";
import { useFilterContext } from "./filterWarper"; // pastikan ini sesuai path lu

type FilterTextInputProps<T extends Record<string, any>> = {
  label?: string;
  name: keyof T;
  placeholder?: string;
  orientation?: "vertical" | "horizontal";
  prefixIcon?: React.ReactNode;
  mode?: "auto" | "manual"; // ✅ per-komponen
  className?: string;
  pattern?: RegExp;
  containerClassName?: string;
  filterInput?: (value: string) => string;
  onEnter?: (value: string) => void; // ✅ custom handler enter
} & InputProps;

export const FilterTextInput = <T extends Record<string, any>>({
  label,
  name,
  placeholder = name as string,
  orientation = "vertical",
  prefixIcon,
  mode = "auto", // ✅ default auto
  className,
  containerClassName,
  filterInput,
  pattern,
  readOnly,
  maxLength,
  minLength,
  min,
  max,
  step,
  onEnter,
}: FilterTextInputProps<T>) => {
  const { values, setValue, tempValues, applyFilters } = useFilterContext();

  // kalau manual, ambil dari tempValues dulu
  const rawValue =
    mode === "manual"
      ? (tempValues?.[name as string] ?? values[name as string])
      : values[name as string];

  const handleEnter = () => {
    if (onEnter) {
      onEnter(rawValue ?? ""); // ✅ custom handler
    } else if (mode === "manual") {
      applyFilters?.(); // ✅ fallback default manual apply
    }
  };

  return (
    <Label
      className={cn(
        "flex flex-grow",
        orientation === "vertical" &&
          "flex-col gap-y-1 items-start justify-center",
        orientation === "horizontal" &&
          "flex-row gap-x-0 justify-center items-center",
        className
      )}
    >
      {label && <span className="w-[70%]">{label}</span>}
      <div
        className={cn(
          "relative flex items-center w-full bg-white",
          containerClassName
        )}
      >
        <div className="absolute left-2">{prefixIcon}</div>
        <Input
          id={String(name)}
          name={String(name)}
          readOnly={readOnly}
          maxLength={maxLength}
          minLength={minLength}
          min={min}
          max={max}
          step={step}
          type="text"
          className="pl-8 w-full"
          placeholder={placeholder || label}
          value={rawValue ?? ""} // ✅ fix
          onChange={(e) => {
            let value = e.target.value;

            if (filterInput) {
              value = filterInput(value);
              e.target.value = value;
            }

            if (pattern && !pattern.test(value)) return;

            setValue(name as string, value, mode); // ✅ kirim mode
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyFilters?.(); // ✅ langsung apply kalau manual
              handleEnter();
            }
          }}
        />
      </div>
    </Label>
  );
};
