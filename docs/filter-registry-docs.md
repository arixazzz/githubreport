# 📄 Filter Registry System

Sistem ini menyediakan cara terpusat untuk mengatur dan memuat opsi filter di seluruh aplikasi tanpa harus mendefinisikan ulang di setiap halaman.  
Menggunakan **React Context**, **TanStack Query**, dan **Atomic Design**.

---

## 📦 Konsep Utama

### 1. Filter Key

- Identifier unik untuk setiap filter.
- Contoh:
  ```ts
  export type FilterKey =
    | "kategoriSurat"
    | "sifatSurat"
    | "disposisi"
    | "statusSurat"
    | "statusVerifikator"
    | "statusPenandatanganan"
    | "statusKirim";
  ```

### 2. Option

- Format standar untuk opsi dropdown:
  ```ts
  export type Option = { label: string; value: string };
  ```

### 3. Registry

- Sumber kebenaran tunggal untuk mapping **FilterKey → sumber data**.
- Setiap key punya `type`:
  - `"static"` → array `Option[]` langsung.
  - `"endpoint"` → endpoint API + optional mapper.
  - `"loader"` → fungsi custom `load` yang bisa pakai `AbortSignal` dan query param.

---

## 🗂 Struktur Data Registry

```ts
export type SourceKind =
  | { type: "static"; data: Option[] }
  | { type: "endpoint"; url: string; map?: (raw: any) => Option[] }
  | {
      type: "loader";
      load: (ctx?: { signal?: AbortSignal; q?: string }) => Promise<Option[]>;
    };

export type FilterRegistry = Record<FilterKey, SourceKind>;
```

Contoh implementasi:

```ts
export const defaultFilterRegistry: FilterRegistry = {
  kategoriSurat: {
    type: "endpoint",
    url: "/api/kategori-surat",
    map: (list) =>
      list.map((d: any) => ({ label: d.nama, value: String(d.id) })),
  },
  sifatSurat: {
    type: "endpoint",
    url: "/api/sifat-surat",
    map: (list) =>
      list.map((d: any) => ({ label: d.nama, value: String(d.kode) })),
  },
  disposisi: {
    type: "loader",
    load: async ({ signal, q }) => {
      const res = await fetch(`/api/disposisi?search=${q ?? ""}`, { signal });
      const json = await res.json();
      return json.map((d: any) => ({ label: d.nama, value: String(d.id) }));
    },
  },
  statusSurat: {
    type: "static",
    data: [
      { label: "Draft", value: "draft" },
      { label: "Terkirim", value: "sent" },
      { label: "Diarsipkan", value: "archived" },
    ],
  },
  // key lainnya...
};
```

---

## 🧩 Provider & Context

### FilterRegistryProvider

- Menyimpan `registry` di React Context.
- Bisa override `registry` default untuk halaman tertentu.

```tsx
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
```

### useFilterRegistry

- Hook untuk mengambil registry dari Context.

```ts
export function useFilterRegistry() {
  return useContext(Ctx);
}
```

---

## 🔍 Hook `useFilterOptions`

- Mengambil opsi filter berdasarkan key dari registry.
- Selalu memanggil `useQuery` untuk mematuhi aturan React Hooks.
- Mendukung:
  - Static data
  - Fetch API (endpoint)
  - Loader custom

```ts
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
        const res = await fetcher(entry.url);
        return entry.map ? entry.map(res) : (res as Option[]);
      }

      // loader custom
      return entry.load({ signal, q });
    },
  });
}
```

---

## 🎛 Komponen `FilterSelectItem`

- Wrapper untuk `FilterSelect` yang otomatis fetch opsi berdasarkan key.

```tsx
export default function FilterSelectItem({ keyName }: { keyName: FilterKey }) {
  const { data = [], isLoading } = useFilterOptions(keyName);
  const label = toLabel(keyName);
  return (
    <FilterSelect
      name={keyName}
      label={label}
      options={data}
      placeholder={label}
      loading={isLoading}
    />
  );
}
```

---

## 🏗 Komponen `FilterSelect` (UI)

- Menggunakan `Popover` + `Command` (Shadcn) untuk search & pilih opsi.
- Mendukung prop `loading` untuk spinner dan skeleton.

```tsx
<FilterSelect
  name="kategoriSurat"
  label="Kategori Surat"
  options={options}
  placeholder="Kategori Surat"
  loading={true}
/>
```

---

## 🧠 Integrasi dengan `FilterBar`

```tsx
export default function FilterBar({ filterKeys }: { filterKeys: FilterKey[] }) {
  return (
    <Filter>
      <DialogContent>
        {filterKeys.map((key) => (
          <FilterSelectItem key={key} keyName={key} />
        ))}
      </DialogContent>
    </Filter>
  );
}
```

---

## ⚡ Cara Pakai

### 1. Pasang di Root Layout

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterRegistryProvider } from "@/filter/RegistryProvider";

const qc = new QueryClient();

export default function RootLayout({ children }) {
  return (
    <QueryClientProvider client={qc}>
      <FilterRegistryProvider>{children}</FilterRegistryProvider>
    </QueryClientProvider>
  );
}
```

### 2. Panggil di Halaman

```tsx
<TableProvider>
  <FilterBar filterKeys={["kategoriSurat", "statusSurat"]} />
</TableProvider>
```

### 3. Override Registry per Halaman (Opsional)

```tsx
<FilterRegistryProvider
  registry={{
    kategoriSurat: {
      type: "loader",
      load: async ({ signal }) => {
        const res = await fetch("/api/kategori-surat?aktif=1", { signal });
        const json = await res.json();
        return json.map((d: any) => ({ label: d.nama, value: String(d.id) }));
      },
    },
  }}
>
  <HalamanSpesifik />
</FilterRegistryProvider>
```

---

## 💡 Tips

- Gunakan `type: "loader"` untuk kasus kompleks (dependent filter, gabungan API).
- Untuk **dependent filter**, masukkan nilai filter parent ke parameter `q` atau extend `ctx` di `load`.
- Untuk **performance**, atur `staleTime` agar data filter tidak refetch terlalu sering.
- Gunakan `enabled` di `useQuery` kalau ingin fetch hanya saat dialog filter dibuka.

---
