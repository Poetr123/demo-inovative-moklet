# 🚀 Moktivasi - Platform Ide Kreatif

Platform berbasis web untuk berbagi ide inovatif antar siswa.  
Setiap pengguna dapat **membuat ide**, **memberi vote (like)**, dan **menghapus ide miliknya sendiri**.  
Dibangun menggunakan **Supabase** sebagai backend dan **Alpine.js + Vanilla JS** untuk frontend.

## 🔧 Backend
Project ini menggunakan **[Supabase](https://supabase.com/)** sebagai backend utama:

- **Database (PostgreSQL)**
  - Tabel `ideas` --> menyimpan ide (judul, deskripsi, jurusan, gambar, user pembuat).
  - Tabel `votes` --> menyimpan vote (like) dari user untuk ide tertentu.
- **Auth (Autentikasi)**
  - User login/register --> Supabase memberikan `user_id` (UUID).
  - `user_id` dipakai untuk menentukan kepemilikan ide/vote.
- **Row Level Security (RLS)**
  - Hanya pemilik ide yang dapat menghapus/mengubah ide.
  - Semua user dapat melihat ide (`SELECT` policy = true).
- **Storage**
  - Menyimpan gambar ide di bucket publik `ideas`.
- **REST API**
  - Supabase otomatis menyediakan endpoint REST (`/rest/v1/ideas`, `/rest/v1/votes`).

---

## 🎨 Frontend

- **UI/UX (HTML + CSS)**
  - Form tambah ide (judul, deskripsi, jurusan, upload gambar).
  - Grid card menampilkan ide (judul, deskripsi, nama user, jumlah vote).
  - Tombol vote 👍 dan tombol hapus 🗑️ (hapus hanya muncul jika ide milik user).
  - Notifikasi (success/error) muncul di bagian atas layar.
- **Interaktivitas**
  - `addIdea()` → tambah ide baru.
  - `loadIdeas()` → ambil semua ide dari Supabase.
  - `toggleLike()` → like/unlike ide.
  - `deleteIdea()` → hapus ide milik user.
- **Validasi Input**
  - Judul: 5–70 karakter.
  - Deskripsi: 15–3000 karakter.

---

## 🖥️ Framework & Library
Project ini menggunakan library ringan tanpa framework besar (seperti React/Vue/Angular):

- **[Alpine.js](https://alpinejs.dev/)** → framework ringan untuk interaktivitas di HTML  
  (binding data: `x-text`, `x-show`, `x-for`, `@click`).
- **Supabase JS SDK** → library resmi untuk menghubungkan frontend ke Supabase (Auth, DB, Storage).
- **Font Awesome (CDN)** → digunakan untuk ikon (👍, 🗑️, dll).

---

## 🔄 Alur Kerja
1. User login → data user tersimpan di state Alpine.js.
2. User menambahkan ide → data dikirim ke tabel `ideas` di Supabase.
3. Frontend memanggil API Supabase → render daftar ide.
4. User bisa melakukan vote (like/unlike) → data tersimpan di tabel `votes`.
5. Jika `idea.user_id === user.id`, tombol 🗑️ muncul → user bisa menghapus idenya.
6. Setiap aksi akan menampilkan notifikasi (berhasil/gagal).
