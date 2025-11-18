import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useId } from "react";
import { Label } from "../ui/label";
import { useFilterContext } from "./filterWarper";

type Option = { value: string; label: string };

type FilterTabsProps<T extends Record<string, any>> = {
  name: keyof T;
  label?: string;
  options: Option[];
  orientation?: "vertical" | "horizontal";
  loading?: boolean;
  disabled?: boolean;
  mode?: "auto" | "manual"; // ✅ per-komponen
};

export default function FilterTabs<T extends Record<string, any>>({
  name,
  label,
  options,
  orientation = "vertical",
  loading = false,
  disabled,
  mode = "auto", // ✅ default auto
}: FilterTabsProps<T>) {
  const { values, setValue, tempValues } = useFilterContext();

  // kalau manual, ambil dari tempValues dulu
  const rawValue =
    mode === "manual"
      ? (tempValues?.[name as string] ?? values[name as string])
      : values[name as string];

  const selectedId = String(rawValue ?? "");
  const selected = options.find((opt) => opt.value === selectedId);

  const uniqueId = useId();
  return (
    <Label
      className={cn(
        "flex w-full",
        orientation === "vertical" && "flex-col gap-y-3 items-start",
        orientation === "horizontal" && "flex-row gap-x-0 items-center"
      )}
    >
      {label && <span className="w-[70%] font-normal">{label}</span>}

      <div className="flex w-full z-0">
        <div className="relative flex gap-3 rounded-full p-1.5 bg-white border border-[#EFF0F6] shadow-md w-fit">
          {options.map((tab) => {
            const active = tab.value === selected?.value;
            return (
              <button
                key={tab.value}
                onClick={() => setValue(name as string, tab.value, mode)}
                className="relative px-2 md:px-4 text-sm py-1 md:py-1.5 rounded-full text-[#70707B] font-medium z-10"
              >
                {selected?.value === tab.value && (
                  <motion.div
                    layoutId={`activeIndicator-${uniqueId}`} // 👈 Unique per Tabs instance
                    className="absolute inset-0 bg-primary rounded-full z-0"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${active ? "text-white" : ""}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Label>
  );
}
