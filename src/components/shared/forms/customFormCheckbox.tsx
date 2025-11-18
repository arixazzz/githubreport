import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import React from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";

export interface CheckboxItem {
  value: string;
  label: string;
}

type CustomFormCheckboxProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  className?: string;
  required?: boolean;
  label?: string;
  description?: string;
  options: CheckboxItem[];
  direction?: "row" | "col";
};

export default function CustomFormCheckbox<
  T extends FieldValues = FieldValues,
>({
  name,
  className,
  required,
  label,
  description,
  options,
  direction = "row",
}: CustomFormCheckboxProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues: string[] = field.value ?? [];

        const toggleValue = (value: string, checked: boolean) => {
          if (checked) {
            field.onChange([...selectedValues, value]);
          } else {
            field.onChange(selectedValues.filter((v) => v !== value));
          }
        };

        return (
          <FormItem className={className}>
            <div className="mb-2">
              {label && (
                <FormLabel className="capitalize">
                  {label}
                  {required && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
              )}
              {description && <FormDescription>{description}</FormDescription>}
            </div>

            <div
              className={cn(
                "flex gap-y-2 gap-x-6",
                direction === "row" && "flex-row flex-wrap",
                direction === "col" && "flex-col"
              )}
            >
              {options.map((item) => (
                <FormItem
                  key={item.value}
                  className="flex flex-row items-center gap-2"
                >
                  <FormControl>
                    <Checkbox
                      checked={selectedValues.includes(item.value)}
                      onCheckedChange={(checked) =>
                        toggleValue(item.value, Boolean(checked))
                      }
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal pb-2">
                    {item.label}
                  </FormLabel>
                </FormItem>
              ))}
            </div>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
