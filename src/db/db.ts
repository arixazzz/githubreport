import Dexie, { Table } from "dexie";

export interface CacheItem {
  key: string;
  data: any;
  updatedAt: Date;
  expiresAt?: Date; // optional
}

export interface OutboxItem {
  id?: number;
  url: string;
  data: any;
  method: string;
  headers?: Record<string, string>;
  createdAt: Date;
  synced: string;
  retryCount?: number;
}

export class LocaleDB extends Dexie {
  cache!: Table<CacheItem, string>;
  outbox!: Table<OutboxItem, number>;

  constructor() {
    super("LocaleDB");
    this.version(2).stores({
      cache: "key, expiresAt",
      outbox: "++id, url, synced, createdAt",
    });
  }
}

export const db = new LocaleDB();
