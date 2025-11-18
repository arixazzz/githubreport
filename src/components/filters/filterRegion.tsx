"use client";

import React, { useMemo } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { useFilterContext } from "./filterWarper";
import { useRegionData } from "@/hooks/useRegionData";

type RegionType = "provinces" | "cities" | "districts" | "villages";

interface FilterRegionProps<T extends Record<string, any>> {
  name: keyof T;
  label?: string;
  placeholder?: string;
  region: RegionType;
  code?: string; // untuk dependency antar region
  orientation?: "vertical" | "horizontal";
  mode?: "auto" | "manual";
}

export function FilterRegion<T extends Record<string, any>>({
  name,
  label,
  placeholder,
  region,
  code,
  orientation = "vertical",
  mode = "auto",
}: FilterRegionProps<T>) {
  const { values, setValue, tempValues } = useFilterContext();

  const rawValue =
    mode === "manual"
      ? (tempValues?.[name as string] ?? values[name as string])
      : values[name as string];

  const selectedCode = String(rawValue ?? "");

  // panggil hook region dinamis
  const { provinces, cities, districts, villages } = useRegionData({
    provinceCode: region === "cities" ? code : undefined,
    cityCode: region === "districts" ? code : undefined,
    districtCode: region === "villages" ? code : undefined,
  });

  const data = useMemo(() => {
    return [
      { label: "Semua", value: "", code: "" },
      ...{
        provinces,
        cities,
        districts,
        villages,
      }[region],
    ];
  }, [region, provinces, cities, districts, villages]);

  const selectedLabel = useMemo(() => {
    return data?.find((v) =>
      region === "provinces"
        ? v.code === selectedCode
        : "full_code" in v && v.full_code === selectedCode
    )?.label;
  }, [selectedCode, data, region]);

  return (
    <Label
      className={cn(
        "flex w-full",
        orientation === "vertical" && "flex-col gap-y-3 items-start",
        orientation === "horizontal" && "flex-row gap-x-2 items-center"
      )}
    >
      {label && <span className="font-normal">{label}</span>}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full border rounded-full justify-between",
              !selectedLabel && "text-muted-foreground"
            )}
          >
            <span className="flex items-center gap-2">
              {(selectedLabel ?? "Semua") || `Pilih ${placeholder}`}
            </span>
            <ChevronDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="md:min-w-[400px] p-0">
          <Command>
            <CommandInput
              placeholder={`Cari ${placeholder}...`}
              className="h-9"
            />
            <CommandList>
              {data?.length === 0 ? (
                <CommandEmpty>Data {placeholder} tidak ditemukan.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {data?.map((item, i) => {
                    const valueToSave =
                      region === "provinces"
                        ? item.code
                        : "full_code" in item
                          ? item.full_code
                          : item.code;
                    const isSelected = valueToSave === selectedCode;

                    return (
                      <CommandItem
                        key={i}
                        value={item.label}
                        onSelect={() =>
                          setValue(name as string, valueToSave, mode)
                        }
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Label>
  );
}
