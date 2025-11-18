# 📄 Dokumentasi Snippets React (VSCode)

## 1. **Tanstack ColumnDef RFC**

- **Prefix**: `coldef`
- **Deskripsi**: Membuat template `ColumnDef` untuk `@tanstack/react-table` dengan dukungan:
  - Nomor urut dinamis (berdasarkan pagination server/client).
  - Meta className untuk header & cell.
  - Contoh kolom `name` & `aksi` dengan custom render.
- **Fungsi**: Mempermudah definisi kolom table dengan format konsisten, lengkap dengan meta styling dan aksi.
- **Contoh Penggunaan**:
  ```tsx
  const columns: ColumnDef<User>[] = coldef;
  ```

---

## 2. **Breadcrumb Form Page With Access**

- **Prefix**: `pageAccForm`
- **Deskripsi**: Membuat halaman form dengan:
  - Breadcrumb navigasi.
  - Access control berbasis `roles` & `permissions`.
  - Form menggunakan `react-hook-form` + `CustomFormInput`.
  - Tombol **Batal** dan **Simpan**.
- **Fungsi**: Template dasar halaman form yang siap dipakai untuk create/update data.
- **Contoh Penggunaan**:
  ```tsx
  export const access: AccessRule = {
    roles: ["admin"],
    permissions: ["user.create"],
  };
  ```

---

## 3. **Breadcrumb Page With Access**

- **Prefix**: `pageAcc`
- **Deskripsi**: Membuat halaman standar dengan:
  - Breadcrumb navigasi.
  - Access control berbasis `roles` & `permissions`.
- **Fungsi**: Template cepat untuk membuat halaman kosong dengan breadcrumb & proteksi akses.
- **Contoh Penggunaan**:
  ```tsx
  export const access: AccessRule = {
    roles: ["admin"],
    permissions: ["dashboard.view"],
  };
  ```

---

## 4. **Breadcrumb Table Page**

- **Prefix**: `pageAccTable`
- **Deskripsi**: Membuat halaman table dengan:
  - Breadcrumb navigasi.
  - Access control.
  - Integrasi `TableProvider`, `TableBar`, dan `DataTable`.
- **Fungsi**: Template halaman list dengan filter, tombol tambah, dan table siap diisi.
- **Contoh Penggunaan**:
  ```tsx
  <TableBar
    filterKeys={["name"]}
    buttonAdd={{ label: "Tambah User", href: "/user/create" }}
  >
    <DataTable columns={userColumns} data={userData} />
  </TableBar>
  ```

---

# Lokasi File

Semua snippet tersimpan di:

```
.vscode/*.code-sippets
```

---
