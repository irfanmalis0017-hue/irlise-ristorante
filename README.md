# IRLISE AI Headquarters

Website kantor 3D terpisah untuk memantau pekerjaan pengembangan IRLISE.

## Fitur prototipe saat ini

- Kantor 3D interaktif berbasis Three.js.
- Ruang CEO dan enam divisi: Game Design, 3D Development, Programming, QA, Performance Engineering, dan Release Management.
- Pemilihan divisi dengan klik monitor/meja di scene 3D.
- Form perintah CEO yang membuat tiket kerja.
- Work queue dengan status Menunggu, Dikerjakan, Perlu review, Selesai, dan Terhambat.
- Tiket disimpan di localStorage browser yang sedang digunakan.

## Batasan yang diketahui

Versi ini adalah **dashboard prototipe sisi-klien**. Pembuatan tiket dan perubahan status belum memicu eksekusi AI, belum terhubung ke antrean backend, dan belum tersinkron antarperangkat/browser. Label READY menunjukkan peran/divisi yang tersedia di antarmuka, bukan agen AI otonom yang sedang berjalan.

## Prinsip keselamatan proyek

- Branch ini terpisah dari `main` dan tidak mengubah website game utama.
- Tidak ada perubahan game atau rilis produksi dari dashboard ini.
- Integrasi GitHub/API, penyimpanan bersama, dan eksekusi tes harus menggunakan backend dengan secrets di server, bukan API key di browser.
- Perubahan ke game harus melalui branch fitur, pemeriksaan QA, dan persetujuan CEO sebelum merge/rilis.

## Teknologi

- HTML, CSS, JavaScript modules
- Three.js 0.160.0 dan OrbitControls melalui jsDelivr CDN
- localStorage untuk penyimpanan tiket lokal prototipe

## Cara menjalankan lokal

Buka branch `irlise-office-3d` melalui static web server. Karena Three.js diimpor sebagai ES module, jangan membuka file dengan skema `file://`.

Contoh:
```bash
python -m http.server 8000
```
Kemudian buka `http://localhost:8000`.

## Tahap pengembangan berikutnya

1. Uji visual dan interaksi 3D di browser desktop dan mobile.
2. Tambahkan backend/API untuk tiket bersama dan riwayat aktivitas.
3. Hubungkan GitHub dengan izin minimum untuk membaca status dan membuat branch/PR.
4. Tambahkan eksekusi QA terisolasi dan laporan hasil.
5. Aktifkan aksi tulis/rilis hanya setelah persetujuan eksplisit CEO.
