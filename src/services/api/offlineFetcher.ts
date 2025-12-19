import { queryClient } from "@/app/QueryProvider";
import { BASE_URL } from "@/constants";
import { db } from "@/db/db";
import Cookies from "js-cookie";
import { convertToFormData, hasFile } from "./fetcher";
import { toast } from "@/lib/myToast";
import { isFunction } from "@tanstack/react-table";
import { APIError } from "@/types/interface";

interface OfflineFetcherInit extends RequestInit {
  ttl?: number;
  queryKey?: any[];
  parseJson?: boolean;
  headers?: Record<string, string>;
  mappingData?: (data: any) => any;
}

const defaultTtl = 1000 * 60 * 60 * 24; // 1 hari

/**
 * Offline-first fetcher yang aman untuk 404 & network error
 */
export async function offlineFetcher<T = any>(
  url: string,
  init?: OfflineFetcherInit
): Promise<T> {
  const cacheKey = url;
  const shouldCache = url !== "auth/me";

  // 🔒 Block khusus supaya tidak pernah fetch ke auth/me (DIHAPUS SUPAYA BISA PAKAI AUTH/ME)
  // if (url === "auth/me") {
  //   console.warn("⛔ Fetch ke auth/me diblokir oleh offlineFetcher");
  //   return { data: {} } as any;
  // }

  const token = Cookies.get("accessToken");
  const {
    mappingData,
    queryKey,
    ttl = defaultTtl,
    parseJson = true,
    headers: customHeaders,
    ...fetchOptions
  } = init || {};

  try {
    const cached = shouldCache ? await db.cache.get(cacheKey) : null;
    if (cached) {
      // Background fetch, error tidak crash
      (async () => {
        try {
          const res = await fetch(`${BASE_URL}/${url}`, {
            ...fetchOptions,
            credentials: "include", // 🔹 Wajib supaya cookie httpOnly terkirim
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              ...(customHeaders ?? {}),
            },
          });

          let data: any = { data: {} };
          if (res.ok) {
            data = parseJson ? await res.json() : res;
            if (isFunction(mappingData)) data = mappingData(data.data);

            if (shouldCache) {
              await db.cache.put({
                key: cacheKey,
                data,
                updatedAt: new Date(),
                expiresAt: new Date(Date.now() + ttl),
              });
            }

            if (queryKey) queryClient.setQueryData(queryKey, data);

            window.dispatchEvent(
              new CustomEvent("cache-updated", {
                detail: { key: cacheKey, data },
              })
            );
          } else {
            console.warn(
              `[OfflineFetcher] background fetch failed: ${res.status}`
            );
          }
        } catch (err) {
          console.warn("⚠️ [OfflineFetcher] background fetch failed:", err);
        }
      })();

      return cached.data as T;
    }

    // Fetch langsung jika cache kosong
    let baseUrl = BASE_URL || "/api";
    // Ensure baseUrl ends with /api
    if (baseUrl && !baseUrl.endsWith("/api")) {
      baseUrl = `${baseUrl.replace(/\/$/, "")}/api`;
    }

    const res = await fetch(`${baseUrl}/${url}`, {
      ...fetchOptions,
      credentials: "include", // 🔹 Wajib supaya cookie httpOnly terkirim
      headers: {
        // Authorization: `Bearer ${token}`, // ❌ Cookie is httpOnly, cannot read client-side
        "Content-Type": "application/json",
        ...(customHeaders ?? {}),
      },
    });

    if (!res.ok) {
      console.warn(`[OfflineFetcher] fetch failed: ${url} ${res.status}`);
      return { data: {} } as any; // fallback aman
    }

    let data = parseJson ? await res.json() : res;
    if (isFunction(mappingData)) data = mappingData(data.data);

    if (shouldCache) {
      await db.cache.put({
        key: cacheKey,
        data,
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + ttl),
      });
    }

    if (queryKey) queryClient.setQueryData(queryKey, data);

    return data;
  } catch (err) {
    console.warn("⚠️ [OfflineFetcher] network error:", url, err);
    return { data: {} } as any; // fallback aman
  }
}

/**
 * Offline send data (POST/PUT/PATCH/DELETE) aman untuk offline
 */
export const offlineSendData = async <T, D extends object>(
  url: string,
  data: D,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  isFormData?: boolean,
  headers?: RequestInit["headers"]
): Promise<T | { offlineSaved: true; message: string }> => {
  if (url === "auth/me") {
    console.warn("⛔ offlineSendData blocked auth/me");
    return { offlineSaved: true, message: "Blocked auth/me request" } as any;
  }

  const token = Cookies.get("accessToken");
  const shouldUseFormData = hasFile(data) || isFormData;

  const _headers: HeadersInit = shouldUseFormData
    ? { Authorization: `Bearer ${token}`, ...(headers || {}) }
    : {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(headers || {}),
      };

  const options: RequestInit = {
    method,
    headers: _headers,
  };

  if (!["DELETE", "GET"].includes(method)) {
    options.body = shouldUseFormData
      ? convertToFormData(data)
      : JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}/${url}`, options);
    if (!response.ok) {
      let errorBody = null;
      try {
        errorBody = await response.json();
      } catch {}
      throw new APIError(
        errorBody?.message || "Request failed",
        response.status,
        errorBody?.data || errorBody
      );
    }

    return await response.json();
  } catch (err: any) {
    const isOffline =
      (err instanceof TypeError && !navigator.onLine) ||
      err.message?.includes("Failed to fetch") ||
      err.message?.includes("NetworkError");

    if (isOffline) {
      console.warn(
        "⚠️ [OfflineSendData] Offline detected, saving to Outbox:",
        url
      );
      await db.outbox.add({
        url,
        data,
        method,
        headers: Object.fromEntries(Object.entries(_headers)),
        createdAt: new Date(),
        synced: "false",
        retryCount: 0,
      });

      toast.warning(
        "Offline",
        "Operasi disimpan lokal & akan disinkronkan saat online",
        { duration: 10000 }
      );

      return {
        offlineSaved: true,
        message: "Data disimpan lokal & akan disinkronkan saat online.",
      } as any;
    }

    console.error("❌ [OfflineSendData] Server error:", err);
    throw err;
  }
};
