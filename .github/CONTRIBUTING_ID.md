# 🙌 Panduan Kontribusi (CONTRIBUTING.md)

> 🇮🇩 Bahasa Indonesia  
> 🇬🇧 [English version below](./CONTRIBUTING.md)

Terima kasih telah berkontribusi dalam proyek ini! Untuk menjaga kualitas kode dan memudahkan kolaborasi tim, harap ikuti alur kerja standar berikut ini:

---

## 🚀 Alur Pengembangan

### 1. Buat Branch Baru

Selalu kerjakan perubahan dari branch baru, **bukan dari `main`**:

```bash
git checkout -b feat/nama-fitur-atau-bugfix
```

---

### 2. Commit Perubahan

Gunakan pesan commit yang deskriptif dan sesuai konvensi: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

Contoh:

```bash
git commit -m "fix: perbaiki validasi input pada form login"
```

---

### 3. Push dan Auto Pull Request

Setelah commit, lakukan push ke branch remote:

```bash
git push origin feat/nama-fitur-atau-bugfix
```

✅ **Jika berhasil**, akan terjadi secara otomatis:

- PR dibuat otomatis dari branch kamu ke `main`
- PR menggunakan template default
- Kamu akan **di-mention dan di-assign** sebagai pemilik PR

⚠️ **Jika tidak otomatis**, buat PR manual:

- Buka tab **Pull Requests** di GitHub
- Klik **"New Pull Request"**
- Pilih `main` sebagai base dan branch kamu sebagai compare
- Pastikan template PR diisi lengkap

---

## 📋 Template PR (WAJIB DIISI)

Setiap PR harus memuat checklist berikut:

- [x] Sudah di-test lokal dan berjalan tanpa error  
- [x] Tidak mengubah file di `main` secara langsung  
- [ ] Deskripsi PR menjelaskan fitur / perbaikan secara ringkas  
- [ ] Sudah direview ulang oleh diri sendiri  

> ❌ PR tanpa checklist lengkap tidak akan di-review / merge

---

## 👀 Review & Merge

- Reviewer dari tim akan melakukan pengecekan kode dan memberikan feedback  
- Jika sudah OK, PR akan di-approve dan di-merge ke `main`  
- PR yang sudah tidak digunakan **wajib di-close**

---

## 🧰 Tools Otomatis

- `Reviewdog + ESLint` otomatis memberi komentar jika ada masalah linting  
- `GitHub Actions` memverifikasi instalasi dan menjalankan lint saat PR dibuat

---

Terima kasih dan selamat berkontribusi! 💪
