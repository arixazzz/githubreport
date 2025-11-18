"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimeInputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TimeInput({
  value,
  defaultValue = "",
  onChange,
  placeholder = "Pilih waktu",
  disabled = false,
  className,
}: TimeInputProps) {
  const [time, setTime] = useState(value || defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");

  // Initialize hours and minutes from time value
  useEffect(() => {
    if (time) {
      const [h, m] = time.split(":");
      setHours(h || "12");
      setMinutes(m || "00");
    }
  }, [time]);

  const handleTimeSelect = (selectedHours: string, selectedMinutes: string) => {
    const newTime = `${selectedHours.padStart(2, "0")}:${selectedMinutes.padStart(2, "0")}`;
    setTime(newTime);
    onChange?.(newTime);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Allow only numbers and colon
    const cleanValue = inputValue.replace(/[^\d:]/g, "");

    // Format as HH:MM
    if (cleanValue.length <= 5) {
      let formatted = cleanValue;
      if (cleanValue.length === 3 && !cleanValue.includes(":")) {
        formatted = cleanValue.slice(0, 2) + ":" + cleanValue.slice(2);
      }

      setTime(formatted);

      // Validate and call onChange if valid time format
      if (/^\d{2}:\d{2}$/.test(formatted)) {
        const [h, m] = formatted.split(":");
        if (Number.parseInt(h) <= 23 && Number.parseInt(m) <= 59) {
          onChange?.(formatted);
        }
      }
    }
  };

  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  };

  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  };

  return (
    <div className="w-full flex flex-col">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              type="text"
              value={time}
              onChange={handleInputChange}
              placeholder={placeholder}
              disabled={disabled}
              className={cn("pr-10", className)}
              onClick={() => !disabled && setIsOpen(!isOpen)}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              className="absolute inset-y-0 right-0 px-3 py-0 h-full"
            >
              <Clock className="h-4 w-4" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="flex">
            {/* Hours Column */}
            <div className="flex-1 border-r border-border">
              <div className="p-2 text-xs font-medium text-muted-foreground border-b border-border">
                Jam
              </div>
              <div className="max-h-40 overflow-y-auto">
                {generateHours().map((hour) => (
                  <Button
                    key={hour}
                    variant={hours === hour ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setHours(hour);
                      handleTimeSelect(hour, minutes);
                    }}
                    className="w-full justify-start rounded-none h-8"
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex-1">
              <div className="p-2 text-xs font-medium text-muted-foreground border-b border-border">
                Menit
              </div>
              <div className="max-h-40 overflow-y-auto">
                {generateMinutes().map((minute) => (
                  <Button
                    key={minute}
                    variant={minutes === minute ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setMinutes(minute);
                      handleTimeSelect(hours, minute);
                    }}
                    className="w-full justify-start rounded-none h-8"
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
