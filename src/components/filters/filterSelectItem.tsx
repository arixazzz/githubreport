"use client";
import React, { useMemo } from "react";
import { useFilterOptions } from "./useFilterOptions";
import type { FilterKey } from "./keys";
import { filterMapping, FilterSelect } from "@/filter";

export default function FilterSelectItem({ keyName }: { keyName: FilterKey }) {
  const getKey = useMemo(() => filterMapping[keyName], [keyName]);
  const { data = [], isLoading } = useFilterOptions(keyName);
  const label = toLabel(keyName);
  return (
    <FilterSelect
      name={getKey}
      label={label}
      options={data}
      placeholder={label}
      loading={isLoading}
      mode="manual"
    />
  );
}

function toLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase());
}
