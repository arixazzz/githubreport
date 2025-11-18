"use client";
import React, { createContext, useContext } from "react";
import { defaultFilterRegistry, type FilterRegistry } from "./registry";

const Ctx = createContext<FilterRegistry>(defaultFilterRegistry);

export function FilterRegistryProvider({
  children,
  registry,
}: {
  children: React.ReactNode;
  registry?: Partial<FilterRegistry>;
}) {
  const merged = { ...defaultFilterRegistry, ...registry } as FilterRegistry;
  return <Ctx.Provider value={merged}>{children}</Ctx.Provider>;
}

export function useFilterRegistry() {
  return useContext(Ctx);
}
