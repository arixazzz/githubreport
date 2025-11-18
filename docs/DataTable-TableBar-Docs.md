# 📄 DataTable + TableBar + TableProvider

Dokumentasi ini menjelaskan cara kerja **DataTable**, **Pagination**, **TableBar**, dan **TableProvider** yang kamu pakai. Setup ini mendukung:

- TanStack React Table v8 (sorting, filtering, column visibility, pagination)
- Virtualized body menggunakan `@tanstack/react-virtual`
- **Ref opsional** lewat `TableProvider` (jika ada provider, table di-_publish_; kalau tidak, tetap jalan)
- Pagination **client-side** _atau_ **server-side**
- Dropdown toggle kolom via `TableBar`
- Kompatibel dengan sistem Filter (Filter, FilterDateRange, FilterSelectItem)

---

## 🔧 Komponen Inti (ringkas)

- **DataTable**: inti tabel; set state; publish `table` ke provider jika ada; render header + body (virtualized); render `Pagination`.
- **Pagination**: kontrol halaman + ukuran halaman. Bisa client-side (via `onChange`) atau server-side (update query param).
- **TableProvider**: context opsional untuk _share_ instance `table` ke komponen lain (mis. `TableBar`).
- **TableBar**: toolbar table (filter, search, date range, toggle kolom) — menarik `table` dari `TableProvider`.

> Catatan: kode di bawah ini menyesuaikan dengan cuplikan yang kamu kirim.

---

## 🚀 Quick Start

### 1) (Opsional) Pasang Provider

Provider hanya dibutuhkan jika ada komponen lain yang perlu akses `table` (mis. `TableBar`). Jika tidak, `DataTable` tetap bisa dipakai tanpa provider.

```tsx
import { TableProvider } from "./tableProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TableProvider>{children}</TableProvider>;
}
```

### 2) Definisikan Kolom & Data

Contoh kolom termasuk kolom penomoran **“No”** yang benar untuk client & server pagination.

```tsx
import type { ColumnDef } from "@tanstack/react-table";

type Row = {
  id: string;
  nomor: string;
  tanggal: string; // ISO string
  kategori: string;
};

export const columns: ColumnDef<Row>[] = [
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row, table }) => {
      // index di DALAM halaman aktif (0-based)
      const pageRows = table.getRowModel().rows;
      const idxInPage = pageRows.findIndex((r) => r.id === row.id);
      const safeIdx = idxInPage >= 0 ? idxInPage : 0;

      // dukung client-side & server-side
      const meta = table.options.meta as
        | { serverPageIndex?: number; serverPageSize?: number }
        | undefined;

      const pageIndex =
        typeof meta?.serverPageIndex === "number"
          ? meta.serverPageIndex
          : table.getState().pagination.pageIndex;

      const pageSize =
        typeof meta?.serverPageSize === "number"
          ? meta.serverPageSize
          : table.getState().pagination.pageSize;

      return pageIndex * pageSize + safeIdx + 1;
    },
  },
  { accessorKey: "nomor", header: "Nomor" },
  { accessorKey: "tanggal", header: "Tanggal" },
  { accessorKey: "kategori", header: "Kategori" },
];
```

Dummy data sederhana untuk uji:

```tsx
function makeDummyRows(n = 100): Row[] {
  const cats = ["Undangan", "Pengumuman", "Nota Dinas", "Memo"];
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    nomor: `ND-${(i + 1).toString().padStart(3, "0")}`,
    tanggal: new Date(Date.now() - i * 86400000).toISOString(),
    kategori: cats[i % cats.length],
  }));
}
```

### 3) Render DataTable (Client-side paginate by default)

```tsx
import { useMemo } from "react";
import DataTable from "./dataTable";
import { columns } from "./columns";

export default function Page() {
  const data = useMemo(() => makeDummyRows(300), []);

  return (
    <DataTable
      columns={columns}
      data={data}
      itemsPerPage={20} // optional; default 5
      bodyHeight={440} // tinggi area scroll (px)
      rowEstimate={44} // estimasi tinggi row (px)
      overscan={12} // buffer virtualizer
    />
  );
}
```

### 4) (Opsional) Pakai TableBar

```tsx
import TableBar from "./tableBar";

export default function Page() {
  const data = useMemo(() => makeDummyRows(300), []);

  return (
    <TableProvider>
      <TableBar filterKeys={["kategoriSurat", "sifatSurat"]} />
      <DataTable columns={columns} data={data} itemsPerPage={20} />
    </TableProvider>
  );
}
```

---

## 🧩 Rincian Komponen

### `<DataTable />`

**Props**

- `columns: any[]` — definisi kolom TanStack.
- `data: TData[]` — data baris.
- `currentPage?: number` — halaman aktif (1-based) untuk **server-side**.
- `totalItems?: number` — total item di server (server-side).
- `itemsPerPage?: number` — ukuran halaman (client **atau** server).
- `totalPages?: number` — total halaman (server-side).
- `bodyHeight?: number` — tinggi kontainer body untuk virtualizer (default **440**).
- `rowEstimate?: number` — estimasi tinggi baris (default **44**).
- `overscan?: number` — jumlah item buffer atas/bawah (default **12**).

**Perilaku Pagination**

- Jika **keempat** (currentPage, totalItems, itemsPerPage, totalPages) diberikan → **server-side**.
  - `Pagination` **tidak** memakai `onChange`; akan fallback ke router (`?page=X&limit=Y`) sesuai implementasi di `Pagination`.
  - `DataTable` menyimpan nilai `serverPageIndex` & `serverPageSize` ke `table.options.meta` untuk penomoran “No”.
- Jika **tidak lengkap** → **client-side**.
  - `Pagination` memakai `onChange` yang memanggil `table.setPageIndex/Size`.

**Ref & Provider**

- `forwardRef<DataTableRef>`: ref tetap expose `{ table }`.
- `TableProvider` opsional. Jika ada provider, `DataTable` akan mem-_publish_ `table`:
  ```ts
  const tableCtx = useOptionalTableProvider();
  useEffect(() => {
    tableCtx?.setTable(table);
    return () => tableCtx?.setTable(null);
  }, [table, tableCtx]);
  ```

**Virtualizer**

- Body tervirtualisasi di dalam kontainer `div` dengan `overflow-auto`.
- DOM pattern: satu row “spacer” setinggi `totalSize`, lalu elemen `<div>` absolut per item virtual untuk membungkus `<TableRow>`.

---

### `<Pagination />`

**Props**

- `currentPage: number`
- `totalItems: number`
- `itemsPerPage: number`
- `totalPages: number`
- `displayItems?: boolean` — tampilkan “Menampilkan x dari y”.
- `displayPageSize?: boolean` — tampilkan select ukuran halaman.
- `onChange?: ({ page, limit }) => void` — jika ada, dipakai (client-side). Jika tidak ada, fallback `router.push` (`?page=X&limit=Y`).

**Catatan Implementasi**

- Saat client-side, DataTable memberi `onChange` sehingga:
  ```ts
  table.setPageIndex(page - 1);
  table.setPageSize(limit);
  ```

---

### `<TableProvider />` (opsional)

**Tujuan**

- _Share_ instance `table` agar komponen lain (mis. `TableBar`) bisa mengakses tanpa prop drilling.

**API**

```ts
type TableProviderCtx = {
  tableRef: React.MutableRefObject<{ table: any } | null>;
  setTable: (t: any | null) => void;
};
```

- `useTableProvider()` — strict (error bila dipakai di luar provider).
- `useOptionalTableProvider()` — soft (balik `undefined` kalau tidak ada provider). Dipakai oleh `DataTable`.

---

### `<TableBar />`

**Fitur**

- Dialog Filter (Filter, FilterDateRange, FilterSelectItem)
- Pencarian teks
- Toggle visibilitas kolom — akses `table` dari `TableProvider`

**Catatan Toggle Kolom**

- Implementasi sekarang membaca visibilitas ketika menu dibuka dan memanggil `col.toggleVisibility(isVisible)` saat berubah.
- Alternatif yang lebih sinkron: pakai `table.setColumnVisibility((prev) => ({ ...prev, [id]: value }))` agar `onColumnVisibilityChange` di DataTable pasti terpanggil.

**Props**

- `buttonAdd?: { label?: string; href: string }`
- `filterKeys?: FilterKey[]`
- `className?: string`
- `children?: React.ReactNode`

---

## 🧠 Snippet Penomoran “No” (Final)

Menghindari bug 21–30 di page 2 saat client-side dengan mengambil index row **di dalam halaman aktif** + dukungan server-side via `meta`:

```tsx
{
  accessorKey: "no",
  header: "No",
  cell: ({ row, table }) => {
    const pageRows = table.getRowModel().rows;
    const idxInPage = pageRows.findIndex((r) => r.id === row.id);
    const safeIdx = idxInPage >= 0 ? idxInPage : 0;

    const meta = table.options.meta as
      | { serverPageIndex?: number; serverPageSize?: number }
      | undefined;

    const pageIndex =
      typeof meta?.serverPageIndex === "number"
        ? meta.serverPageIndex
        : table.getState().pagination.pageIndex;

    const pageSize =
      typeof meta?.serverPageSize === "number"
        ? meta.serverPageSize
        : table.getState().pagination.pageSize;

    return pageIndex * pageSize + safeIdx + 1;
  },
}
```

---

## ⚙️ Virtualizer Tips

- **bodyHeight**: wajib ada agar scroll container muncul (mis. 440).
- **rowEstimate**: setinggi rata-rata 1 row; semakin akurat semakin halus.
- **overscan**: tambah jika scroll sangat cepat (trade-off performa vs smoothness).

---

## 🧰 Troubleshooting

- **Toggle kolom tidak bereaksi** → pastikan `TableProvider` membungkus `TableBar` dan `DataTable`. Coba `table.setColumnVisibility` alih-alih `col.toggleVisibility`.
- **Nomor “No” salah di halaman 2** → pakai snippet “No” final di atas.
- **Virtualizer tidak jalan** → cek `bodyHeight` dan `overflow-auto` di kontainer body.
- **Hook error** → jangan panggil hook kondisional; jadikan `queryFn` yang bercabang kalau pakai React Query di tempat lain.
- **Tanpa Provider?** → aman. Provider cuma untuk akses `table` lintas komponen.

---

## 📎 Catatan Versi

- TanStack React Table v8
- @tanstack/react-virtual v3
