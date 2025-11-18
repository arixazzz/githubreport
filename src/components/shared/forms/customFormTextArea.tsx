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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CustomFormTextAreaProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  textareaClassName?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  maxLength?: number;
  minLength?: number;
  rows?: number;
  showCharacterCount?: boolean;
  maxCharacterCount?: number;
}

export function CustomFormTextArea<T extends FieldValues = FieldValues>({
  name,
  label,
  placeholder,
  description,
  className,
  textareaClassName,
  required = false,
  disabled = false,
  readOnly = false,
  onChange,
  maxLength,
  minLength,
  rows = 3,
  showCharacterCount = false,
  maxCharacterCount,
}: CustomFormTextAreaProps<T>) {
  const form = useFormContext<T>();
  const fieldValue = form.watch(name) || "";
  const characterCount = fieldValue.length;
  const isOverLimit = maxCharacterCount && characterCount > maxCharacterCount;
  return (
    <FormField
      control={form.control}
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
            <Textarea
              placeholder={placeholder}
              className={cn(
                "bg-card rounded-xl",
                textareaClassName,
                isOverLimit &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={maxLength}
              minLength={minLength}
              rows={rows}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e.target.value);
              }}
            />
          </FormControl>
          {(description || showCharacterCount) && (
            <div className="flex justify-between items-start mt-1.5">
              {description && (
                <FormDescription className={cn(showCharacterCount && "flex-1")}>
                  {description}
                </FormDescription>
              )}
              {showCharacterCount && (
                <div
                  className={cn(
                    "text-xs text-muted-foreground",
                    isOverLimit && "text-destructive font-medium"
                  )}
                >
                  {characterCount}
                  {maxCharacterCount && `/${maxCharacterCount}`}
                </div>
              )}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
