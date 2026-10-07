# AGENTS.md: Instruksi untuk AI Agent

Dokumen ini adalah panduan utama. Baca file ini terlebih dahulu, lalu `PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, dan kerjakan sesuai `TASKS.md`.

## Konteks Proyek
Web Music Player dengan visualizer untuk tugas kuliah Multimedia. Pemilik proyek adalah mahasiswa; kode harus mudah dibaca dan dijelaskan saat presentasi.

## Tech Stack (WAJIB)
- HTML5, CSS3, JavaScript ES6+ (vanilla, **tanpa framework**, **tanpa bundler**).
- Web Audio API + Canvas 2D untuk visualizer.
- Boleh: Google Fonts, ikon SVG inline.
- Dilarang: React/Vue/jQuery, npm dependency untuk runtime, CDN selain Google Fonts.

## Struktur Folder
```
music-player/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js          # inisialisasi & penghubung modul
│   ├── player.js        # logika audio & kontrol
│   ├── playlist.js      # render & state playlist
│   ├── visualizer.js    # Web Audio + Canvas
│   └── utils.js         # helper (formatTime, dll)
├── data/
│   └── playlist.js      # array data lagu
├── assets/
│   ├── audio/
│   └── images/
└── README.md
```
Jangan menambah folder/file di luar struktur ini tanpa alasan kuat.

## Aturan Coding
1. Gunakan `const`/`let`, jangan `var`.
2. Pakai ES Modules (`<script type="module">`).
3. Satu modul = satu tanggung jawab. Hindari variabel global.
4. Nama variabel/fungsi dalam bahasa Inggris (camelCase); komentar dalam Bahasa Indonesia, singkat.
5. Jangan hardcode data lagu di HTML; semua dari `data/playlist.js`.
6. CSS: gunakan CSS variables untuk warna/spasi (lihat `DESIGN.md`). Class naming gaya BEM sederhana.
7. Semua tombol ikon wajib punya `aria-label`.
8. Tangani error: file audio gagal dimuat harus menampilkan pesan, bukan crash.
9. Jangan menulis `localStorage` selain untuk tema dan volume.

## Hal yang Harus Diperhatikan
- `AudioContext` baru boleh dibuat/di-resume setelah interaksi pengguna.
- `createMediaElementSource` hanya boleh dipanggil **sekali** per elemen audio.
- Hentikan loop `requestAnimationFrame` saat lagu di-pause agar hemat CPU.
- Saat berganti lagu, set `audio.src` lalu `load()` dan `play()`; jangan membuat elemen `Audio` baru.

## Alur Kerja
1. Kerjakan task di `TASKS.md` **berurutan**, satu fase per giliran.
2. Setelah tiap fase: jelaskan singkat apa yang dibuat, lalu centang task terkait.
3. Jika ada ambiguitas, ambil keputusan paling sederhana yang sesuai PRD dan catat asumsinya; jangan menambah fitur di luar PRD.
4. Jangan menghapus atau menulis ulang file yang sudah selesai kecuali diminta atau ada bug.

## Definition of Done
- Semua kriteria penerimaan di `PRD.md` bagian 7 terpenuhi.
- Tidak ada error/warning di console browser.
- `README.md` berisi: deskripsi, cara menjalankan (via server lokal), daftar fitur, dan sumber/lisensi aset.

## Cara Menjalankan (untuk pengujian)
```bash
python -m http.server 8000
# buka http://localhost:8000
```
