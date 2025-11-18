"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";

export interface DataTableRef {
  table: any;
}

type TableProviderCtx = {
  tableRef: React.MutableRefObject<DataTableRef | null>;
  setTable: (t: any | null) => void;
};

const Ctx = createContext<TableProviderCtx | undefined>(undefined);

export function TableProvider({ children }: { children: React.ReactNode }) {
  // MutableRefObject → boleh reassign .current
  const tableRef = useRef<DataTableRef | null>(null);

  const setTable = useCallback((t: any | null) => {
    tableRef.current = t === null ? null : { table: t };
  }, []);

  const value = useMemo(() => ({ tableRef, setTable }), [setTable]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Strict: error kalau dipakai di luar <TableProvider> */
export function useTableProvider(): TableProviderCtx {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useTableProvider must be used within <TableProvider>");
  return ctx;
}

/** Optional: undefined kalau tidak ada provider */
export function useOptionalTableProvider(): TableProviderCtx | undefined {
  return useContext(Ctx);
}
