import Dexie, { Table } from "dexie";

/** Struktur cache di IndexedDB */
interface RegionCacheItem {
  key: string;
  data: any;
  updatedAt: Date;
  expiresAt: Date;
}

/** Setup Dexie */
class RegionDB extends Dexie {
  cache!: Table<RegionCacheItem, string>;

  constructor() {
    super("RegionDB");
    this.version(1).stores({
      cache: "key, expiresAt",
    });
  }
}

export const dbRegion = new RegionDB();
