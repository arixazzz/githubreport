# 📦 Offline-First Data Layer Documentation

This document explains the implementation of an **Offline-First Data Layer** using `Dexie.js`, React Query, and local caching mechanisms in IndexedDB.

---

## 🗂️ File Structure

```
src/
├── db/
│   └── db.ts
├── services/
│   └── api/
│       └── offlineFetcher.ts
└── hooks/
    └── useCustomQuery.ts
```

---

## 🧩 1. src/db/db.ts

### Purpose

Defines the **Dexie database schema** used for caching API data and managing the outbox queue for offline mutations.

### Key Features

- **Cache Table** → Stores GET responses with expiration time.
- **Outbox Table** → Stores unsent POST/PUT/PATCH/DELETE operations when the user is offline.

### Schema

```ts
this.version(2).stores({
  cache: "key, expiresAt",
  outbox: "++id, url, synced, createdAt",
});
```

---

## 🌐 2. src/services/api/offlineFetcher.ts

### Purpose

Provides two main utilities:

1. `offlineFetcher` → For **GET** requests with Dexie caching (stale-while-revalidate).
2. `offlineSendData` → For **POST/PUT/PATCH/DELETE** with offline queuing support.

### Features

- **Local-first fetching** → Returns cached data instantly and updates in background.
- **Outbox queue** → Saves unsent requests when offline.
- **Auto-sync** when the device is back online.
- **Automatic cache cleaning** (expired entries).

### Example

```ts
const data = await offlineFetcher("users", { ttl: 1000 * 60 * 10 });
await offlineSendData("posts", { title: "New" }, "POST");
```

---

## 🔁 3. Outbox Sync and Cache Cleaner

### Auto Sync Mechanism

When the browser goes online again, the app automatically:

- Syncs pending outbox requests.
- Cleans expired cache.

```ts
window.addEventListener("online", () => {
  syncOutbox();
  cleanExpiredCache();
});
```

### Manual Trigger

```ts
await syncOutbox();
await cleanExpiredCache();
```

---

## ⚡ 4. src/hooks/useCustomQuery.ts

### Purpose

A wrapper for `useQuery` from React Query to unify **local** and **network** fetching strategies.

### Usage

```ts
const { data } = useCustomQuery({
  queryKey: ["users"],
  queryUrl: "users",
  cachePolicy: "local", // use IndexedDB (offline-first)
  ttl: 1000 * 60 * 5, // 5 minutes TTL
});
```

### Parameters

| Prop          | Type                   | Default   | Description                      |
| ------------- | ---------------------- | --------- | -------------------------------- |
| `queryKey`    | `string[]`             | required  | React Query key                  |
| `queryUrl`    | `string`               | required  | API endpoint                     |
| `cachePolicy` | `"local" \| "network"` | `"local"` | Use Dexie cache or network fetch |
| `ttl`         | `number`               | `120000`  | Time to live for cache (in ms)   |

---

## 🚀 Summary

✅ Cached GET requests (local-first)  
✅ Offline-safe POST/PUT/DELETE (outbox queue)  
✅ Auto sync & cleanup when online  
✅ React Query integration with offline mode

---

**Author:** Newus Teknologi  
**Module:** Offline-First Data Layer  
**Version:** 1.0.0
