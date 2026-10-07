# PRD: Web Music Player dengan Visualizer

## 1. Ringkasan
Website pemutar musik berbasis HTML/CSS/JavaScript murni untuk tugas mata kuliah Multimedia. Pengguna dapat memutar lagu dari playlist, mengontrol pemutaran, dan melihat visualisasi audio real-time.

**Tema:** Playlist Musik Sunda / Lo-fi (dapat diganti, cukup ubah `data/playlist.js`).

## 2. Tujuan
- Mendemonstrasikan integrasi elemen multimedia: audio, gambar, animasi, interaktivitas, teks.
- Menghasilkan website yang rapi, responsif, dan siap dipresentasikan.
- Dapat dijalankan tanpa build tool, tanpa backend, cukup membuka `index.html`.

## 3. Target Pengguna
- Dosen/penilai tugas Multimedia.
- Pengguna umum yang ingin memutar musik sederhana di browser.

## 4. Ruang Lingkup

### In Scope (Must Have)
| ID | Fitur | Deskripsi |
|---|---|---|
| F1 | Play/Pause | Tombol toggle pemutaran |
| F2 | Next/Previous | Pindah lagu dalam playlist |
| F3 | Progress bar | Menampilkan posisi lagu, dapat digeser (seek), dengan waktu saat ini dan durasi |
| F4 | Volume | Slider volume + tombol mute |
| F5 | Info lagu | Judul, artis, cover album |
| F6 | Playlist | Daftar lagu dapat diklik, lagu aktif ditandai |
| F7 | Auto-next | Lanjut ke lagu berikutnya saat selesai |

### Should Have
| ID | Fitur | Deskripsi |
|---|---|---|
| F8 | Visualizer | Bar equalizer real-time via Web Audio API + Canvas |
| F9 | Cover berputar | Animasi rotasi seperti piringan hitam saat lagu diputar |
| F10 | Shuffle & Repeat | Mode acak dan ulang (off / semua / satu lagu) |
| F11 | Responsif | Nyaman di HP dan desktop |

### Nice to Have
| ID | Fitur | Deskripsi |
|---|---|---|
| F12 | Dark/Light mode | Toggle tema, disimpan di localStorage |
| F13 | Pencarian lagu | Filter playlist berdasarkan judul/artis |
| F14 | Keyboard shortcut | Spasi = play/pause, panah kiri/kanan = prev/next |

### Out of Scope
- Backend, login, database.
- Upload lagu oleh pengguna.
- Streaming dari layanan pihak ketiga.

## 5. Elemen Multimedia (untuk penilaian)
| Elemen | Implementasi |
|---|---|
| Audio | File MP3 lokal, elemen `<audio>`, Web Audio API |
| Gambar | Cover album, ikon (SVG) |
| Animasi | Rotasi cover, visualizer canvas, transisi UI |
| Interaktivitas | Kontrol pemutaran, playlist, slider |
| Teks | Judul, artis, waktu, (opsional) lirik |

## 6. Persyaratan Non-Fungsional
- Berjalan di Chrome, Firefox, Edge, Safari versi terbaru.
- Tidak ada dependensi eksternal wajib (boleh Google Fonts).
- Waktu muat awal < 2 detik (di luar file audio).
- Aksesibilitas dasar: tombol punya `aria-label`, dapat diakses keyboard, kontras warna memadai.
- Kode terstruktur dan berkomentar singkat dalam Bahasa Indonesia.

## 7. Kriteria Penerimaan
- [ ] Semua fitur Must Have berfungsi tanpa error di console.
- [ ] Visualizer bergerak sinkron dengan musik.
- [ ] Tampilan tidak rusak pada lebar 360px sampai 1920px.
- [ ] Mengganti lagu tidak menyebabkan suara ganda.
- [ ] Browser autoplay policy ditangani (audio baru mulai setelah interaksi pengguna).
- [ ] Ada README berisi cara menjalankan dan sumber/lisensi aset.

## 8. Aset yang Dibutuhkan
- 5-8 file MP3 bebas hak cipta (Pixabay Music, Free Music Archive, YouTube Audio Library) di `assets/audio/`.
- Cover album (JPG/WEBP, 500x500) di `assets/images/`.
- Catat sumber dan lisensi tiap aset di `README.md`.

## 9. Risiko
| Risiko | Mitigasi |
|---|---|
| Web Audio API diblokir CORS bila dibuka via `file://` | Jalankan lewat server lokal (`npx serve` / `python -m http.server`) |
| Autoplay diblokir browser | Mulai `AudioContext` saat klik pertama |
| Ukuran file audio besar | Gunakan MP3 128kbps |
