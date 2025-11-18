"use client";

import React, { useEffect, useState } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multiSelect";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomFormMultiSelectProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  options: SelectOption[];
  className?: string;
  required?: boolean;
  disabled?: boolean;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "inverted"
    | null
    | undefined;
  animation?: number;
  maxCount?: number;
  /**
   * Callback function triggered when a new option is created.
   * Receives the new option object.
   */
  onOptionCreate?: (
    option: { label: string; value: string },
    onSuccessSet?: (created: { label: string; value: string }) => void
  ) => void;
}

export function CustomFormMultiSelect<T extends FieldValues = FieldValues>({
  name,
  label,
  placeholder = "Pilih Opsi",
  description,
  options,
  className,
  required = false,
  disabled = false,
  variant,
  animation,
  maxCount,
  onOptionCreate,
}: CustomFormMultiSelectProps<T>) {
  const { control } = useFormContext<T>();
  const [newOptions, setNewOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (options) {
      setNewOptions(options);
    }
  }, [options]);

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
            <MultiSelect
              key={field.value}
              options={newOptions}
              onValueChange={(values) => field.onChange(values)}
              defaultValue={field.value || []}
              placeholder={placeholder}
              variant={variant}
              animation={animation}
              maxCount={maxCount}
              disabled={disabled}
              allowCreate={!!onOptionCreate}
              className="shadow-none min-h-9"
              onOptionCreate={onOptionCreate}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
