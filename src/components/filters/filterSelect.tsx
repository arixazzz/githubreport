"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilterContext } from "./filterWarper";
import { Label } from "@/components/ui/label";
import React from "react";

type Option = { value: string; label: string };

type FilterSelectProps<T extends Record<string, any>> = {
  name: keyof T;
  label?: string;
  options: Option[];
  placeholder?: string;
  orientation?: "vertical" | "horizontal";
  loading?: boolean; // ⬅️ baru
  loadingText?: string; // ⬅️ baru
  notFoundText?: string; // ⬅️ opsional
  disabled?: boolean; // ⬅️ opsional
  mode?: "auto" | "manual"; // ✅ per-komponen
};

export const FilterSelect = <T extends Record<string, any>>({
  name,
  label,
  options,
  placeholder,
  orientation = "vertical",
  loading = false,
  loadingText = "Memuat…",
  notFoundText,
  disabled,
  mode = "auto", // ✅ default auto
}: FilterSelectProps<T>) => {
  const { values, setValue, tempValues } = useFilterContext();

  // kalau manual, ambil dari tempValues dulu
  const rawValue =
    mode === "manual"
      ? (tempValues?.[name as string] ?? values[name as string])
      : values[name as string];

  const selectedId = String(rawValue ?? "");
  const selected = options.find((opt) => opt.value === selectedId);

  // skeleton item untuk efek shimmer saat loading
  const SkeletonItem = () => (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="h-4 w-40 rounded bg-muted animate-pulse" />
      <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
    </div>
  );

  return (
    <Label
      className={cn(
        "flex w-full",
        orientation === "vertical" && "flex-col gap-y-3 items-start",
        orientation === "horizontal" && "flex-row gap-x-0 items-center"
      )}
    >
      {label && <span className="w-[70%] font-normal">{label}</span>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded="false"
            aria-busy={loading}
            disabled={disabled || loading}
            className={cn(
              "w-full border rounded-full justify-between",
              !selected?.label && "text-muted-foreground",
              loading && "cursor-wait opacity-90"
            )}
          >
            <span className="flex items-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {selected?.label || `Pilih ${placeholder}`}
            </span>
            <ChevronDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="md:min-w-[400px] p-0">
          <Command key={`${selected?.value}-${options.length}`}>
            <CommandInput
              placeholder={`Search ${placeholder}...`}
              className="h-9"
              disabled={loading}
            />
            <CommandList>
              {/* state loading */}
              {loading ? (
                <div className="p-2">
                  <div className="flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {loadingText}
                  </div>
                  <CommandGroup className="mt-1">
                    {/* skeleton placeholders */}
                    <SkeletonItem />
                    <SkeletonItem />
                    <SkeletonItem />
                  </CommandGroup>
                </div>
              ) : options.length === 0 ? (
                <>
                  <CommandEmpty>
                    {notFoundText ?? `Data ${placeholder} Tidak Ada.`}
                  </CommandEmpty>
                </>
              ) : (
                <CommandGroup>
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.label}
                      onSelect={() => setValue(name as string, opt.value, mode)} // ✅ fix
                    >
                      {opt.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          opt.value === selectedId ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Label>
  );
};
