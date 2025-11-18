import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";

import { FilterKey, Option, useFilterRegistry } from "@/filter";
import { offlineFetcher } from "@/services/api/offlineFetcher";

export function useFilterOptions(key: FilterKey, q?: string) {
  const registry = useFilterRegistry();
  const entry = registry[key];

  // stabil: selalu panggil useQuery
  return useQuery<Option[]>({
    queryKey: [
      "filterOptions",
      key,
      entry?.type ?? "none",
      entry?.type === "endpoint" ? (entry as any).url : null,
      q ?? null,
    ] as const,
    queryFn: async ({ signal }: QueryFunctionContext) => {
      if (!entry) return [];

      if (entry.type === "static") {
        return entry.data;
      }

      if (entry.type === "endpoint") {
        const res = await offlineFetcher(entry.url);
        return entry.map ? entry.map(res.data) : (res.data as Option[]);
      }

      // loader custom
      return entry.load({ signal, q });
    },
  });
}
