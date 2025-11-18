import { queryClient } from "@/app/QueryProvider";
import { BASE_URL } from "@/constants";
import { db } from "@/db/db";
import Cookies from "js-cookie";
import { convertToFormData, hasFile } from "./fetcher";
import { toast } from "@/lib/myToast";
import { isFunction } from "@tanstack/react-table";
import { APIError } from "@/types/interface";

interface OfflineFetcherInit extends RequestInit {
  ttl?: number; // TTL dalam milidetik
  queryKey?: any[];
  parseJson?: boolean; // default true
  headers?: Record<string, string>;
  mappingData?: (data: any) => any; // ✅ fungsi opsional untuk mapping hasil
}

const defaultTtl = 1000 * 60 * 60 * 24; // 1 hari

/**
 * Local-first (stale-while-revalidate) fetcher.
 * Selalu return cache dulu (kalau ada), lalu update di background.
 */
export async function offlineFetcher<T = any>(
  url: string,
  init?: OfflineFetcherInit
): Promise<T> {
  const cacheKey = url;
  const token = Cookies.get("accessToken");
  const {
    mappingData,
    queryKey,
    ttl = defaultTtl,
    parseJson = true,
    headers: customHeaders,
    ...fetchOptions
  } = init || {};

  // =========================================================
  // STEP 1 — Ambil cache dulu agar UI cepat render
  // =========================================================
  const cached = await db.cache.get(cacheKey);
  if (cached) {
    // console.log("📦 [OfflineFetcher] return cached:", cacheKey);

    // =========================================================
    // STEP 2 — Lakukan background fetch untuk update cache
    // =========================================================
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/${url}`, {
          ...fetchOptions,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...(customHeaders ?? {}),
          },
        });

        if (!res.ok) {
          if (res.status === 498) Cookies.remove("accessToken");
          throw new Error(`Network error ${res.status}`);
        }

        let data = init?.parseJson === false ? res : await res.json();

        // ✅ Jalankan mappingData jika disediakan
        if (isFunction(mappingData)) {
          try {
            data = mappingData(data.data);
          } catch (err) {
            console.warn("⚠️ [OfflineFetcher] mappingData error:", err);
          }
        }

        // ✅ Simpan ke IndexedDB
        await db.cache.put({
          key: cacheKey,
          data,
          updatedAt: new Date(),
          expiresAt: new Date(Date.now() + ttl),
        });

        // console.log("🔄 [OfflineFetcher] cache updated:", cacheKey);

        // ✅ Update React Query cache
        if (init?.queryKey) {
          queryClient.setQueryData(init.queryKey, data);
          // console.log(
          //   "🌀 [OfflineFetcher] React Query updated:",
          //   init.queryKey
          // );
          // console.log("data updated : ", data);
        }

        // ✅ Trigger custom event
        window.dispatchEvent(
          new CustomEvent("cache-updated", { detail: { key: cacheKey, data } })
        );
      } catch (err) {
        console.warn("⚠️ [OfflineFetcher] background fetch failed:", err);
      }
    })();

    // return cache langsung untuk UI
    return cached.data as T;
  }

  // =========================================================
  // STEP 3 — Kalau belum ada cache, fetch langsung
  // =========================================================
  try {
    const res = await fetch(`${BASE_URL}/${url}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!res.ok) throw new Error(`Network error ${res.status}`);

    let data = init?.parseJson === false ? res : await res.json();

    // ✅ Jalankan mappingData kalau ada
    if (typeof init?.mappingData === "function") {
      try {
        data = init.mappingData(data);
      } catch (err) {
        console.warn("⚠️ [OfflineFetcher] mappingData error:", err);
      }
    }

    // 💾 Simpan ke IndexedDB
    await db.cache.put({
      key: cacheKey,
      data,
      updatedAt: new Date(),
      expiresAt: new Date(Date.now() + ttl),
    });

    // console.log("✅ [OfflineFetcher] fresh data saved:", cacheKey);
    return data;
  } catch (err) {
    console.error("❌ [OfflineFetcher] fetch failed:", cacheKey, err);
    throw new Error("No network and no cache available");
  }
}

// ====================================================
// Offline Send Data Function (Updated Version)
// ====================================================
export const offlineSendData = async <T, D extends object>(
  url: string,
  data: D,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  isFormData?: boolean,
  headers?: RequestInit["headers"]
): Promise<T> => {
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
    // ===============================================
    // 1️⃣ Coba kirim langsung ke server
    // ===============================================
    const response = await fetch(`${BASE_URL}/${url}`, options);

    // Jika server merespons tapi error (4xx / 5xx)
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

    // Sukses
    const result = await response.json();
    return result as T;
  } catch (err: any) {
    // ====================================================
    // 2️⃣ Tangani khusus untuk error OFFLINE
    // ====================================================
    const isOffline =
      (err instanceof TypeError && !navigator.onLine) ||
      err.message?.includes("Failed to fetch") ||
      err.message?.includes("NetworkError");

    if (isOffline) {
      console.warn(
        "⚠️ [OfflineSendData] Offline detected, storing to Outbox:",
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
        "Operasi disimpan ke local & akan disinkronkan saat online",
        { duration: 10000 }
      );

      return {
        offlineSaved: true,
        message: "Data disimpan lokal & akan disinkronkan saat online.",
      } as any;
    }

    // ====================================================
    // 3️⃣ Kalau error lain (server error, bad request, dll)
    // ====================================================
    console.error("❌ [OfflineSendData] Server error:", err);
    throw err; // biar tetap ditangani di UI (misal alert / toast error)
  }
};

export async function syncOutbox() {
  const pending = await db.outbox.where({ synced: "false" }).toArray();

  for (const item of pending) {
    try {
      toast.loading("Sync", "Melakukan Sync", { id: item.url });
      const res = await fetch(`${BASE_URL}/${item.url}`, {
        method: item.method,
        headers: item.headers,
        body: ["DELETE", "GET"].includes(item.method)
          ? undefined
          : JSON.stringify(item.data),
      });

      if (res.ok) {
        toast.removeToast(item.url);
        await db.outbox.delete(item.id!);
        console.log("✅ [OutboxSync] Synced:", item.url);
      } else {
        toast.removeToast(item.url);
        toast.error("Sync", `Gagal Sync : ${res.status}`);
        console.warn("❌ [OutboxSync] Server error:", item.url, res.status);
      }
    } catch (err) {
      console.warn("⚠️ [OutboxSync] Still offline, retry later:", item.url);
    }
  }
}

export async function cleanExpiredCache() {
  const now = Date.now();
  await db.cache.where("expiresAt").below(new Date(now)).delete();
  console.log("[CacheCleaner] 🧹 expired cache cleared");
}

// listener auto sync kalau online lagi
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("🔄 Online detected, syncing outbox...");
    syncOutbox();
    console.log("🔄 Online detected, cleanExpiredCache...");
    cleanExpiredCache();
  });
  window.addEventListener("load", () => {
    cleanExpiredCache();
    syncOutbox();
  });
}
