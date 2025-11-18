import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TimeInput } from "@/components/ui/timeInput";
import { FieldValues, Path, useFormContext } from "react-hook-form";

type CustomFormTimeProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  className?: string;
  required?: boolean;
  label?: string;
  description?: string;
  disabled?: boolean;
  placeholder?: string;
};

export default function CustomFormTime<T extends FieldValues = FieldValues>({
  name,
  className,
  required,
  label,
  description,
  disabled,
  placeholder,
}: CustomFormTimeProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="capitalize">
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl className="mt-[2px]">
              <TimeInput
                className={className}
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
                placeholder={placeholder}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
