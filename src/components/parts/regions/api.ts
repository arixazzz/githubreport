import { useQueries, useQuery } from "@tanstack/react-query";
import {
  City,
  District,
  Provinces,
  RegionCodeMap,
  RegionNamesResult,
  RegionType,
  Village,
} from "./interface";
import { REGION_URL } from "@/constants";
import { dbRegion } from "@/db/dbRegion";

/**
 * 🧠 fetcherRegion — local-first fetcher khusus data wilayah
 * - Simpan data ke IndexedDB
 * - TTL default: 30 hari
 * - Selama cache belum expired → ambil dari cache aja (tanpa fetch ulang)
 * - Kalau cache belum ada / expired → baru ambil dari server dan update cache
 */
export const fetcherRegion = async (url: string): Promise<any> => {
  const cacheKey = `region::${url}`;
  const now = Date.now();
  const oneMonthMs = 1000 * 60 * 60 * 24 * 30; // 30 hari

  try {
    // 1️⃣ Coba ambil dari cache
    const cached = await dbRegion.cache.get(cacheKey);
    if (cached) {
      const isExpired = new Date(cached.expiresAt).getTime() < now;
      if (!isExpired) {
        console.log("📦 [RegionFetcher] Load from IndexedDB cache:", cacheKey);
        return cached.data;
      }
    }

    // 2️⃣ Kalau belum ada / expired → ambil dari server
    console.log(
      "🌐 [RegionFetcher] Cache not found or expired, fetching:",
      cacheKey
    );
    const res = await fetch(`${REGION_URL}/${url}`, {
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const data = await res.json();

    // 3️⃣ Simpan ke cache
    await dbRegion.cache.put({
      key: cacheKey,
      data,
      updatedAt: new Date(),
      expiresAt: new Date(now + oneMonthMs),
    });

    console.log("💾 [RegionFetcher] Cache updated:", cacheKey);
    return data;
  } catch (err) {
    console.warn("⚠️ [RegionFetcher] Error fetch, fallback to cache:", err);

    // 4️⃣ Kalau fetch gagal, dan cache lama masih ada → kembalikan cache lama
    const cached = await dbRegion.cache.get(cacheKey);
    if (cached) {
      console.log("📦 [RegionFetcher] Return stale cache:", cacheKey);
      return cached.data;
    }

    throw err;
  }
};

export const useProvinces = () => {
  return useQuery<ApiResponse<DataArray<Provinces>>, Error>({
    queryKey: ["useProvinces"],
    queryFn: () => fetcherRegion("region/provinces"),
  });
};

export const useCities = (code?: string) => {
  return useQuery<ApiResponse<DataArray<City>>, Error>({
    queryKey: ["useCities", code],
    queryFn: () => fetcherRegion(`region/regencies/code/${code}`),
    enabled: !!code,
  });
};

export const useRegencys = (fullCode: string) => {
  return useQuery<ApiResponse<DataObject<City>>, Error>({
    queryKey: ["useRegency", fullCode],
    queryFn: () => fetcherRegion(`region/regency/code/${fullCode}`),
    enabled: !!fullCode,
  });
};

export const useDistricts = (fullCode?: string) => {
  return useQuery<ApiResponse<DataArray<District>>, Error>({
    queryKey: ["useDistricts", fullCode],
    queryFn: () => fetcherRegion(`region/districts/code/${fullCode}`),
    enabled: !!fullCode,
  });
};

export const useVillages = (fullCode?: string) => {
  return useQuery<ApiResponse<DataArray<Village>>, Error>({
    queryKey: ["useVillages", fullCode],
    queryFn: () => fetcherRegion(`region/villages/code/${fullCode}`),
    enabled: !!fullCode,
  });
};

// export const useGetRegion = <T>(code: string, type: RegionType) => {
//   const endpointMap: Record<RegionType, string> = {
//     province: `region/province/code/${code}`,
//     regency: `region/regency/code/${code}`,
//     district: `region/district/code/${code}`,
//     village: `region/village/code/${code}`,
//   };

//   return useQuery<ApiResponse<DataObject<T>>, Error>(
//     ["useGetRegion", type, code],
//     () => fetcherRegion(endpointMap[type]),
//     {
//       enabled: !!code,
//       staleTime: 1000 * 60 * 5,
//       cacheTime: 1000 * 60 * 30,
//       refetchOnWindowFocus: false,
//       retry: 1,
//     }
//   );
// };

// const fetchRegionByType = async (
//   code: string,
//   type: RegionType
// ): Promise<ApiResponse<any>> => {
//   const endpointMap: Record<RegionType, string> = {
//     province: `region/province/code/${code}`,
//     regency: `region/regency/code/${code}`,
//     district: `region/district/code/${code}`,
//     village: `region/village/code/${code}`,
//   };
//   const res = await fetch(`${BASE_URL}/${endpointMap[type]}`);
//   if (!res.ok) throw new Error("Failed to fetch region");
//   return res.json();
// };

/**
 * Hook untuk mengambil nama beberapa region sekaligus berdasarkan kode dan tipe region yang diinginkan.
 *
 * @param codes Object yang berisi kode region per tipe (province, regency, district, village).
 *              Contoh: { province: "11", regency: "1101" }
 * @param types Array region yang ingin diambil, misal ["province", "district"]
 *
 * @returns Object yang berisi nama region, status loading, dan error untuk setiap tipe region yang diminta.
 *          Contoh hasil: {
 *            province: "Lampung",
 *            provinceLoading: false,
 *            provinceError: null,
 *            district: "Way Jepara",
 *            districtLoading: true,
 *            districtError: null
 *          }
 */
export const useRegionNames = (
  codes: RegionCodeMap,
  types: RegionType[]
): RegionNamesResult => {
  const queries = useQueries({
    queries: types.map((type) => {
      const code = codes[type];
      const endpointMap: Record<RegionType, string> = {
        province: `region/province/code/${code}`,
        regency: `region/regency/code/${code}`,
        district: `region/district/code/${code}`,
        village: `region/village/code/${code}`,
      };

      return {
        queryKey: ["region", type, code || ""],
        queryFn: () => fetcherRegion(endpointMap[type]),
        enabled: !!code,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        retry: 1,
      };
    }),
  });

  return types.reduce((acc, type, i) => {
    acc[type] = queries[i].data?.data?.name ?? null;
    acc[`${type}Loading`] = queries[i].isLoading;
    acc[`${type}Error`] = queries[i].isError ? queries[i].error : null;
    return acc;
  }, {} as RegionNamesResult);
};
