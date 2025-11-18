"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Parse string to primitive types: number, boolean, array, or string
 */
const parseValue = (
  val: string
): string | number | boolean | (string | number)[] | undefined => {
  if (val === "") return undefined;

  // Deteksi array
  if (val.includes(",")) {
    const parts = val.split(",");

    // Apakah semuanya angka?
    const allNumbers = parts.every((v) => !isNaN(Number(v)));
    return allNumbers ? parts.map((v) => Number(v)) : parts;
  }

  // Boolean
  if (val === "true") return true;
  if (val === "false") return false;

  // Coba parse number
  const num = Number(val);
  return isNaN(num) ? val : num;
};

/**
 * Convert search params to typed object { [key]: string | number | boolean | array }
 */
export const useQueryObject = <T extends Record<string, any>>(): T => {
  const searchParams = useSearchParams();

  const queryObject = useMemo(() => {
    const entries = Array.from(searchParams.entries());
    return Object.fromEntries(entries.map(([k, v]) => [k, parseValue(v)])) as T;
  }, [searchParams]);

  return queryObject;
};
