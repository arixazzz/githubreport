"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Locale, id as localeID } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CustomFormCalendarProps<T extends FieldValues = FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  buttonClassName?: string;
  required?: boolean;
  disabled?: boolean;
  locale?: Locale;
  dateFormat?: string;
  /** batas awal tanggal yang diizinkan */
  fromDate?: Date;
  /** batas akhir tanggal yang diizinkan (default: today) */
  toDate?: Date;
  /** fungsi tambahan untuk mendisable tanggal tertentu */
  disabledDates?: (date: Date) => boolean;
  /** callback ketika tanggal berubah */
  onChange?: (date: Date | undefined) => void;
  /** dropdown tahun di header calendar (min) */
  fromYear?: number;
  /** dropdown tahun di header calendar (max) */
  toYear?: number;
}

export function CustomFormCalender<T extends FieldValues = FieldValues>({
  name,
  label,
  placeholder = "Pilih Tanggal",
  description,
  className,
  buttonClassName,
  required = false,
  disabled = false,
  locale = localeID,
  dateFormat = "yyyy-MM-dd",
  fromDate,
  toDate,
  disabledDates,
  onChange,
}: CustomFormCalendarProps<T>) {
  const form = useFormContext<T>();
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name={name as Path<T>}
      render={({ field }) => {
        const selected = field.value ? new Date(field.value) : undefined;

        const handleSelect = (d?: Date) => {
          field.onChange(d ? format(d, dateFormat, { locale }) : undefined);
          onChange?.(d ?? undefined);
          setOpen(false);
        };

        return (
          <FormItem className={cn(className)}>
            {label && (
              <FormLabel className="capitalize">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-between rounded-full pl-4 pr-4 py-[9px] h-10 bg-card border-input shadow-sm",
                    buttonClassName
                  )}
                  aria-required={required}
                  aria-label={label ?? "Tanggal"}
                >
                  <span className={cn(!selected && "text-muted-foreground")}>
                    {selected
                      ? format(selected, "dd-MM-yyyy", { locale })
                      : placeholder}
                  </span>
                  <CalendarIcon className="h-4 w-4 opacity-70" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  captionLayout="dropdown"
                  startMonth={
                    fromDate
                      ? new Date(new Date(fromDate).getFullYear() - 10, 0)
                      : undefined
                  }
                  selected={selected}
                  onSelect={handleSelect}
                  disabled={toDate ?? disabledDates}
                  autoFocus
                />
              </PopoverContent>
            </Popover>

            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
