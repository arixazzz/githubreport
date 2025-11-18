"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import SignatureBox, { SignatureBoxProps } from "@/components/shared/signature";

type CustomFormSignatureProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  label?: string;
  className?: string;
  inline?: boolean;
  required?: boolean;
  description?: boolean;
  disabled?: boolean;
} & SignatureBoxProps;

export function CustomFormSignature<T extends FieldValues = FieldValues>({
  name,
  label,
  className,
  required = false,
  disabled = false,
  description,
  lineWidth,
}: CustomFormSignatureProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="capitalize">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <SignatureBox
              lineWidth={lineWidth}
              onSaved={(e) => {
                field.onChange(e.blob);
              }}
              valueString={field.value}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
