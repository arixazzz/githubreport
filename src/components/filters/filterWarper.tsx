"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useQueryObject } from "@/hooks/useQueryObject";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type FilterContextType = {
  values: Record<string, any>;
  initialValues: Record<string, any>;
  setValue: (key: string, value: any, mode?: "auto" | "manual") => void;
  resetValues: () => void;
  applyFilters?: () => void;
  tempValues?: Record<string, any>;
  activeFilterCount: number;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilterContext = (opts?: {
  defaultValues?: Record<string, any>;
}) => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilterContext must be used within <Filter>");

  // inject defaultValues ke provider sekali aja
  useEffect(() => {
    if (opts?.defaultValues) {
      Object.entries(opts.defaultValues).forEach(([key, val]) => {
        if (ctx.values[key] === undefined) {
          ctx.setValue(key, val, "auto"); // set langsung ke state provider
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ jalan sekali waktu mount

  return ctx;
};

type FilterProps = {
  children: React.ReactNode | ((ctx: FilterContextType) => React.ReactNode);
  initialValues?: Record<string, any>;
  mode?: "auto" | "manual";
};

export const Filter = ({
  children,
  initialValues = {},
  mode = "auto",
}: FilterProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const query = useQueryObject();

  const [values, setValues] = useState<Record<string, any>>({
    ...initialValues,
    ...query,
  });

  const [tempValues, setTempValues] = useState<Record<string, any>>({});

  const debouncedValues = useDebounce({ value: values, delay: 400 });

  const pushToUrl = useCallback(
    (val: Record<string, any>) => {
      const params = new URLSearchParams();
      Object.entries(val).forEach(([key, v]) => {
        if (v !== undefined && v !== "" && v !== null) {
          params.set(key, Array.isArray(v) ? v.join(",") : String(v));
        }
      });
      const queryStr = params.toString();
      router.push(queryStr ? `${pathname}?${queryStr}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router]
  );

  // Auto mode jalan sendiri
  useEffect(() => {
    if (mode === "auto") pushToUrl(debouncedValues);
  }, [debouncedValues, mode, pushToUrl]);

  const applyFilters = useCallback(() => {
    const merged = { ...values, ...tempValues };
    // cek apakah semua kosong → reset
    const allEmpty = Object.values(merged).every(
      (v) => v === undefined || v === "" || v === null
    );
    if (allEmpty) {
      setValues(initialValues);
      setTempValues({});
      pushToUrl(initialValues);
    } else {
      setValues(merged);
      pushToUrl(merged);
      setTempValues({});
    }
  }, [values, tempValues, pushToUrl, initialValues]);

  const setValue = useCallback(
    (key: string, value: any, m: "auto" | "manual" = mode) => {
      const isEmpty = value === undefined || value === "" || value === null;

      if (m === "auto") {
        setValues((prev) => {
          if (isEmpty) {
            const next = { ...prev };
            delete next[key]; // ✅ cuma hapus field itu
            return next;
          }
          return { ...prev, [key]: value };
        });
      } else {
        setTempValues((prev) => {
          if (isEmpty) {
            const next = { ...prev };
            delete next[key]; // ✅ cuma hapus field itu
            return next;
          }
          return { ...prev, [key]: value };
        });
      }
    },
    [mode]
  );

  const resetValues = useCallback(() => {
    setValues(initialValues);
    setTempValues({});
    pushToUrl(initialValues);
  }, [initialValues, pushToUrl]);

  const activeFilterCount = useMemo(() => {
    return Object.entries(values).filter(([key, v]) => {
      const initVal = initialValues[key];

      // kosong → skip
      const isEmpty =
        v === undefined ||
        v === null ||
        v === "" ||
        (Array.isArray(v) && v.length === 0);

      if (isEmpty) return false;

      // sama dengan initial value → skip
      if (JSON.stringify(v) === JSON.stringify(initVal)) return false;

      return true; // ✅ hanya yang aktif & sudah apply
    }).length;
  }, [values, initialValues]);

  const contextValue = useMemo(
    () => ({
      values,
      setValue,
      resetValues,
      initialValues,
      applyFilters,
      tempValues,
      activeFilterCount,
    }),
    [
      values,
      setValue,
      resetValues,
      initialValues,
      applyFilters,
      tempValues,
      activeFilterCount,
    ]
  );

  useEffect(() => {
    setValues((prev) => {
      const next = { ...initialValues, ...prev };
      // jangan update kalau sama → biar gak infinite loop
      if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
      return next;
    });
  }, [initialValues]);

  return (
    <FilterContext.Provider value={contextValue}>
      {typeof children === "function" ? children(contextValue) : children}
    </FilterContext.Provider>
  );
};
