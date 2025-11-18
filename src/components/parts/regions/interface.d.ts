export interface Provinces {
  id: number;
  name: string;
  code: string;
}

export interface City {
  id: number;
  type: string;
  name: string;
  code: string;
  full_code: string;
  provinsi_id: number;
}

export interface District {
  id: number;
  name: string;
  code: string;
  full_code: string;
  kabupaten_id: number;
}

export interface Village {
  id: number;
  name: string;
  code: string;
  full_code: string;
  pos_code: string;
  kecamatan_id: number;
}

/**
 * Jenis region yang bisa diambil
 */
export type RegionType = "province" | "regency" | "district" | "village";

/**
 * Bentuk kode-kode region yang bisa dikirim ke hook.
 * Properti optional karena bisa ambil sebagian saja.
 */
export type RegionCodeMap = Partial<Record<RegionType, string>>;

/**
 * Tipe hasil data per region yang dikembalikan hook.
 *
 * Untuk setiap region, kembalikan:
 * - Nama region (string) atau null kalau belum ada data
 * - Status loading (boolean)
 * - Error jika ada, atau null
 */
export interface RegionNamesResult {
  province?: string | null;
  provinceLoading?: boolean;
  provinceError?: unknown | null;

  regency?: string | null;
  regencyLoading?: boolean;
  regencyError?: unknown | null;

  district?: string | null;
  districtLoading?: boolean;
  districtError?: unknown | null;

  village?: string | null;
  villageLoading?: boolean;
  villageError?: unknown | null;
}
