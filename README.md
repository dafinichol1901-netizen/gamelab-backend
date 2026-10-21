# GameLab Backend

REST API untuk membaca dan mengelola kelas GameLab. API di folder `src/` memakai Express dan **Mongoose** untuk mengakses collection `daftar_kelas_pemrograman` di database `db_gamelab_indonesia`. File `index.js` di root tetap menjadi latihan CLI terpisah yang memakai MongoDB Driver.

## Yang tersedia

- CRUD koleksi `daftar_kelas_pemrograman`, dipisah menjadi Model, Service, Controller, dan Routes.
- Pencarian, pagination, dan sorting di `GET /api/kelas`.
- Pendaftaran/login dengan password yang di-hash dan token JWT.
- Pembacaan kelas bersifat publik; tambah, ubah, dan hapus kelas perlu token admin.
- Endpoint statistik yang perlu API key.
- Validasi input dan penanganan error dengan response JSON yang konsisten.
- Tes Jest/Supertest, dokumentasi Swagger, dan koleksi Postman.
- Entry point dan konfigurasi Vercel sudah disiapkan; deploy tetap perlu akun, database cloud, dan pengaturan environment.

## Persyaratan

- Node.js 20.19 atau lebih baru.
- npm.
- MongoDB yang dapat dijangkau oleh komputer ini. Proyek sebelumnya memakai database `db_gamelab_indonesia`.

## Menjalankan secara lokal

1. Instal dependency dengan `npm install`.
2. Pastikan `.env` tersedia. Jangan timpa `.env` lama yang berisi alamat MongoDB. Jika belum ada, salin `.env.example` menjadi `.env`.
3. Isi `JWT_SECRET` dengan teks acak minimal 32 karakter dan ganti `EXTERNAL_API_KEY` dengan nilai acak. Jangan bagikan atau commit file `.env`.
4. Jalankan `npm run dev` untuk mode pengembangan, atau `npm start` untuk menjalankan server biasa.
5. Buka `http://localhost:3000/` untuk health check dan `http://localhost:3000/api-docs` untuk dokumentasi Swagger.

Port default adalah `3000`; bisa diubah lewat `PORT`. Nama database mengikuti `MONGODB_DB_NAME`, dengan default `db_gamelab_indonesia`.

## Menyiapkan admin pertama

Pendaftaran publik selalu membuat role `user`. Field `role` dari request akan ditolak, supaya orang tidak bisa mendaftarkan dirinya sendiri sebagai admin.

Untuk membuat admin awal:

1. Tambahkan `BOOTSTRAP_ADMIN_EMAIL` dan `BOOTSTRAP_ADMIN_PASSWORD` yang kuat (12–72 karakter) ke `.env`.
2. Jalankan `npm run seed:admin` satu kali. Perintah ini membuat akun admin dan menyimpan password dalam bentuk hash.
3. Hapus dua nilai bootstrap tersebut dari `.env` setelah berhasil.
4. Login melalui `POST /api/auth/login`. Gunakan token di header `Authorization: Bearer <token>` untuk menambah, mengubah, atau menghapus kelas.

Perintah bootstrap menolak membuat akun jika email tersebut sudah digunakan. Ia tidak mengubah role atau password akun yang ada.

## Environment variables

| Nama | Wajib | Kegunaan |
| --- | --- | --- |
| `MONGODB_URI` | Ya | Connection string MongoDB. Jangan unggah kredensialnya. |
| `MONGODB_DB_NAME` | Tidak | Default `db_gamelab_indonesia`. |
| `PORT` | Tidak | Port server lokal, default `3000`. |
| `NODE_ENV` | Disarankan | `development`, `test`, atau `production`; stack trace hanya dikirim di development. |
| `JWT_SECRET` | Untuk login | Secret acak minimal 32 karakter untuk tanda tangan JWT. |
| `JWT_EXPIRES_IN` | Tidak | Masa berlaku token, default `1d`. |
| `EXTERNAL_API_KEY` | Untuk statistik | Key rahasia untuk `/api/stats/summary`. |
| `BOOTSTRAP_ADMIN_EMAIL` | Sekali saat setup | Email akun admin awal. Hapus setelah bootstrap. |
| `BOOTSTRAP_ADMIN_PASSWORD` | Sekali saat setup | Password akun admin awal. Hapus setelah bootstrap. |

`.env` dan `.env.test` diabaikan Git. Untuk layanan hosting, masukkan nilai environment lewat pengaturan rahasia di dashboard hosting.

## Endpoint

| Method | Endpoint | Akses | Kegunaan |
| --- | --- | --- | --- |
| `GET` | `/` | Publik | Health check |
| `POST` | `/api/auth/register` | Publik | Membuat akun role `user` |
| `POST` | `/api/auth/login` | Publik | Login dan mendapatkan JWT |
| `GET` | `/api/kelas?page=1&limit=10&q=html&sortBy=nama&order=asc` | Publik | Daftar kelas dengan pencarian dan pagination |
| `GET` | `/api/kelas/:id` | Publik | Detail kelas |
| `POST` | `/api/kelas` | JWT admin | Membuat kelas |
| `PUT` | `/api/kelas/:id` | JWT admin | Memperbarui kelas |
| `DELETE` | `/api/kelas/:id` | JWT admin | Menghapus kelas |
| `GET` | `/api/stats/summary` | `x-api-key` | Jumlah kelas |
| `GET` | `/api-docs` | Publik | Swagger UI |

`limit` maksimal `100`; `sortBy` hanya menerima `_id`, `nama`, atau `deskripsi`. Hasil daftar ada di `data.items`, bersama `total`, `page`, `limit`, dan `totalPages`. Model kelas memakai `_id` bertipe Mixed agar ID angka dari data lama tetap bisa dibaca; data kelas baru memakai `ObjectId`. ID angka/string lama dan `ObjectId` tetap didukung. Body kelas boleh mengikuti field dokumen yang sudah dipakai; `_id` tidak bisa diubah dan operator MongoDB ditolak.

Contoh body kelas:

```json
{
  "nama": "Kelas JavaScript",
  "deskripsi": "Belajar dasar JavaScript"
}
```

Error memakai status HTTP yang sesuai: `400` untuk input salah, `401` untuk token/key yang tidak valid, `403` untuk role yang tidak berhak, `404` bila data tidak ditemukan, `409` bila email sudah terdaftar, dan `500` untuk gangguan server.

## Postman dan Swagger

Import `postman/GameLab Backend.postman_collection.json` dan environment `postman/GameLab Local.postman_environment.json`. Isi password admin dan API key pada environment lokal. Jalankan request Login admin lebih dulu untuk menyimpan token; kemudian jalankan operasi CRUD. Swagger UI tersedia di `/api-docs` setelah server hidup.

## Tes otomatis

Jalankan `npm test`. Jest dan Supertest menguji auth, validasi, pembatasan role, CRUD, pagination, serta API key. Tes memakai MongoDB sementara dari `mongodb-memory-server`; database di `.env` tidak digunakan oleh rangkaian tes ini.

## Struktur file utama

```text
api/index.js                 entry point serverless Vercel
src/config/                  koneksi MongoDB dan spesifikasi Swagger
src/middlewares/             logger, auth, validasi, error, API key
src/models/                  schema, model, dan query Mongoose
src/services/                aturan bisnis
src/controllers/             response HTTP
src/routes/                  endpoint API
src/validators/              aturan validasi request
src/utils/                   AppError dan pembungkus async
scripts/seed-admin.js        bootstrap admin satu kali
tests/                       tes Jest dan Supertest
postman/                     collection dan environment contoh
```

`index.js` lama tetap menjadi latihan CLI yang mengakses MongoDB Driver. REST API di folder `src/` memakai Mongoose. Keduanya menggunakan database yang sama.

## GitHub dan Vercel

Sebelum membuat repository online, pastikan tidak ada `.env`, token, atau password yang masuk ke staging Git. Setelah meninjau `git status`, simpan commit lokal. Push ke GitHub hanya setelah repository tujuan dan visibilitasnya dipastikan.

`api/index.js` dan `vercel.json` menyiapkan bentuk serverless Vercel. Untuk deploy, perlu repository GitHub, akun Vercel, `MONGODB_URI` yang bisa dijangkau dari cloud, serta `JWT_SECRET` dan `EXTERNAL_API_KEY` baru yang berbeda dari komputer lokal. Jangan gunakan `MONGODB_URI` localhost di hosting. Pengaturan Network Access database harus mengikuti pilihan jaringan yang aman dan cocok dengan hosting; jangan membuka akses database luas tanpa meninjau risikonya.

Proyek ini sudah di-push ke GitHub dan pernah di-deploy ke Vercel. Setelah perubahan ini, push commit baru agar Vercel membuat deployment terbaru. Pastikan environment variable di Vercel tetap berisi URI MongoDB cloud serta secret yang sesuai.
