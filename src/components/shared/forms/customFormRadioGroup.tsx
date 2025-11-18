"use client";

import React from "react";
import { useFormContext, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type CustomFormRadioGroupProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  label?: string;
  options: Option[];
  description?: string;
  className?: string;
  containerClassName?: string;
  inline?: boolean;
  required?: boolean;
  disabled?: boolean;
};

export function CustomFormRadioGroup<T extends FieldValues = FieldValues>({
  name,
  label,
  options,
  description,
  className,
  inline = true,
  required = false,
  disabled = false,
  containerClassName,
}: CustomFormRadioGroupProps<T>) {
  const { control } = useFormContext<T>();

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
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn(
                "gap-4",
                inline ? "flex items-center" : "flex flex-col",
                containerClassName
              )}
            >
              {options.map((opt) => (
                <FormItem
                  key={opt.value}
                  className={cn(
                    "space-y-0 space-x-2",
                    "flex items-center",
                    inline && "space-x-3"
                  )}
                >
                  <FormControl>
                    <RadioGroupItem
                      value={opt.value}
                      disabled={opt.disabled ?? disabled}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{opt.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
