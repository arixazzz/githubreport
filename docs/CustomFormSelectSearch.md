# 📌 Dokumentasi `CustomFormSelectSearch`

## Deskripsi

`CustomFormSelectSearch` adalah komponen **form field** berbasis `react-hook-form` untuk memilih satu opsi dari daftar dengan dukungan pencarian dan pembuatan opsi baru.  
Dilengkapi dengan:

- Integrasi penuh dengan `react-hook-form`.
- Virtualized list (`@tanstack/react-virtual`) untuk performa saat data banyak.
- Dukungan pencarian real-time.
- Bisa menambahkan opsi baru dengan `Enter` (jika `onOptionCreate` diset).

---

## Props

| Prop             | Tipe                                 | Default        | Deskripsi                                                               |
| ---------------- | ------------------------------------ | -------------- | ----------------------------------------------------------------------- |
| `name`           | `Path<T>`                            | **required**   | Nama field sesuai register di `react-hook-form`.                        |
| `label`          | `string`                             | `undefined`    | Label yang ditampilkan di atas input.                                   |
| `placeholder`    | `string`                             | `"Pilih opsi"` | Placeholder saat belum ada pilihan.                                     |
| `description`    | `string`                             | `undefined`    | Deskripsi tambahan di bawah input.                                      |
| `options`        | `{ value: string; label: string }[]` | **required**   | Daftar opsi yang bisa dipilih.                                          |
| `className`      | `string`                             | `undefined`    | Custom class tambahan.                                                  |
| `required`       | `boolean`                            | `false`        | Menandai input sebagai wajib diisi.                                     |
| `disabled`       | `boolean`                            | `false`        | Menonaktifkan input.                                                    |
| `onOptionCreate` | `(option, onSuccessSet) => void`     | `undefined`    | Callback jika user mengetik opsi baru. Harus return `{ label, value }`. |

---

## Contoh Penggunaan

### 1. Basic

```tsx
import { useForm, FormProvider } from "react-hook-form";
import CustomFormSelectSearch from "@/components/form/customFormSelectSearch";

const options = [
  { value: "indonesia", label: "Indonesia" },
  { value: "japan", label: "Japan" },
  { value: "korea", label: "Korea" },
];

export default function ExamplePage() {
  const form = useForm({
    defaultValues: {
      country: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormSelectSearch
          name="country"
          label="Pilih Negara"
          placeholder="Negara"
          options={options}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
}
```

---

### 2. Dengan `onOptionCreate` (buat opsi baru)

```tsx
<CustomFormSelectSearch
  name="category"
  label="Kategori"
  placeholder="Pilih atau buat kategori"
  options={[
    { value: "tech", label: "Teknologi" },
    { value: "health", label: "Kesehatan" },
  ]}
  onOptionCreate={(option, onSuccessSet) => {
    // Simulasi API create ke backend
    setTimeout(() => {
      console.log("Created:", option);
      onSuccessSet?.(option);
    }, 500);
  }}
/>
```

> User bisa ketik nama kategori baru → tekan Enter → otomatis ditambahkan.

---

## Catatan

- **Integrasi Validasi**: Gunakan `zod` atau schema validasi lain di `react-hook-form` untuk kontrol required.
- **Nilai yang disimpan**: Field menyimpan string (`value`) dari opsi yang dipilih.
- **Virtualized List**: Komponen menggunakan `@tanstack/react-virtual` untuk performa optimal bila opsi sangat banyak.
