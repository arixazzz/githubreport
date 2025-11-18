# 📌 Dokumentasi `CustomFormMultiSelect`

## Deskripsi

`CustomFormMultiSelect` adalah komponen **form field** berbasis `react-hook-form` yang membungkus komponen `MultiSelect`.  
Dipakai untuk memilih **lebih dari satu opsi** dalam form, dengan dukungan:

- Integrasi penuh dengan `react-hook-form`.
- Validasi required.
- Bisa menambahkan opsi baru secara dinamis (jika `onOptionCreate` diset).
- Support variasi tampilan (`variant`).
- Limit jumlah pilihan (`maxCount`).

---

## Props

| Prop             | Tipe                                                              | Default        | Deskripsi                                                                                      |
| ---------------- | ----------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------- |
| `name`           | `Path<T>`                                                         | **required**   | Nama field sesuai register di `react-hook-form`.                                               |
| `label`          | `string`                                                          | `undefined`    | Label yang ditampilkan di atas input.                                                          |
| `placeholder`    | `string`                                                          | `"Pilih opsi"` | Placeholder saat belum ada pilihan.                                                            |
| `description`    | `string`                                                          | `undefined`    | Deskripsi tambahan di bawah input.                                                             |
| `options`        | `{ value: string; label: string }[]`                              | **required**   | Daftar opsi yang bisa dipilih.                                                                 |
| `className`      | `string`                                                          | `undefined`    | Custom class tambahan.                                                                         |
| `required`       | `boolean`                                                         | `false`        | Menandai input sebagai wajib diisi.                                                            |
| `disabled`       | `boolean`                                                         | `false`        | Menonaktifkan input.                                                                           |
| `variant`        | `"default" \| "secondary" \| "destructive" \| "inverted" \| null` | `undefined`    | Variasi tampilan untuk `MultiSelect`.                                                          |
| `animation`      | `number`                                                          | `undefined`    | Durasi animasi (ms) untuk transisi pilihan.                                                    |
| `maxCount`       | `number`                                                          | `undefined`    | Batas maksimal jumlah opsi yang bisa dipilih.                                                  |
| `onOptionCreate` | `(option, onSuccessSet) => void`                                  | `undefined`    | Callback jika user mengetik opsi baru (custom create). Harus return object `{ label, value }`. |

---

## Contoh Penggunaan

### 1. Basic

```tsx
import { useForm, FormProvider } from "react-hook-form";
import { CustomFormMultiSelect } from "@/components/form/customFormMultiSelect";

const options = [
  { value: "js", label: "JavaScript" },
  { value: "ts", label: "TypeScript" },
  { value: "py", label: "Python" },
];

export default function ExamplePage() {
  const form = useForm({
    defaultValues: {
      skills: [],
    },
  });

  const onSubmit = (data: any) => {
    console.log("Form Data:", data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormMultiSelect
          name="skills"
          label="Pilih Skill"
          placeholder="Pilih skill favorit"
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

### 2. Dengan `maxCount` (batas pilihan)

```tsx
<CustomFormMultiSelect
  name="hobbies"
  label="Hobi"
  placeholder="Pilih hobi"
  options={[
    { value: "reading", label: "Membaca" },
    { value: "gaming", label: "Gaming" },
    { value: "coding", label: "Ngoding" },
    { value: "sports", label: "Olahraga" },
  ]}
  maxCount={2}
/>
```

> User hanya bisa memilih maksimal **2 opsi**.

---

### 3. Dengan `onOptionCreate` (buat opsi baru)

```tsx
<CustomFormMultiSelect
  name="tags"
  label="Tags"
  placeholder="Tambah atau pilih tag"
  options={[
    { value: "react", label: "React" },
    { value: "nextjs", label: "Next.js" },
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

> User bisa ketik tag baru → tekan Enter → otomatis ditambahkan.

---

## Catatan

- **Integrasi Validasi**: Gunakan `zod` atau schema validasi lain di `react-hook-form` untuk kontrol required & tipe data array.
- **Nilai yang disimpan**: Field menyimpan array string (`string[]`) berisi `value` dari opsi yang dipilih.
- **Custom Styling**: Tambahkan class lewat prop `className`.
