"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { useRegionData } from "@/hooks/useRegionData";

type CustomFromRegionsType = "provinces" | "cities" | "districts" | "villages";

type CustomFromRegionsProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  label?: string;
  description?: string;
  region: CustomFromRegionsType;
  code?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export default function CustomFromRegions<T extends FieldValues = FieldValues>({
  name,
  region,
  code,
  placeholder,
  required,
  className,
  label,
  description,
}: CustomFromRegionsProps<T>) {
  const { control, watch } = useFormContext<T>();
  const [open, setOpen] = useState(false);

  const selectedCode = watch(name) as string;

  const { provinces, cities, districts, villages } = useRegionData({
    provinceCode: region === "cities" ? code : undefined,
    cityCode: region === "districts" ? code : undefined,
    districtCode: region === "villages" ? code : undefined,
  });

  const data = {
    provinces,
    cities,
    districts,
    villages,
  }[region];

  const findLabel = () => {
    return data?.find((v) =>
      region === "provinces"
        ? v.code === selectedCode
        : "full_code" in v && v.full_code === selectedCode
    )?.label;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="capitalize">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full rounded-full h-10 justify-between text-sm",
                    selectedCode ? "text-black" : "text-gray-500"
                  )}
                  size="sm"
                >
                  {findLabel() || `Pilih ${placeholder}`}
                  <ChevronDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput
                    placeholder={`Cari ${placeholder}...`}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>
                      Data {placeholder} tidak ditemukan.
                    </CommandEmpty>
                    <CommandGroup>
                      {data?.map((v, i) => {
                        const valueToSave =
                          region === "provinces"
                            ? v.code
                            : "full_code" in v
                              ? v.full_code
                              : v.code;

                        const isSelected = valueToSave === selectedCode;

                        return (
                          <CommandItem
                            value={v.label}
                            key={i}
                            onSelect={() => {
                              field.onChange(valueToSave);
                              setOpen(false);
                            }}
                          >
                            {v.label}
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
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
