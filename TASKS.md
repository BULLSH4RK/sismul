# TASKS.md

Kerjakan berurutan. Centang `[x]` setelah selesai. Satu fase per giliran, lalu berhenti dan laporkan.

## Fase 0: Setup
- [x] Buat struktur folder sesuai `AGENTS.md`
- [x] Buat `index.html` kosong dengan meta viewport, link CSS, dan script module
- [x] Siapkan `data/playlist.js` dengan 3 lagu placeholder
- [x] Buat `README.md` awal

## Fase 1: Markup dan Styling
- [x] Susun HTML: cover, info lagu, canvas, progress, kontrol, volume, playlist, toast
- [x] Definisikan design tokens di `style.css` (lihat `DESIGN.md`)
- [x] Layout desktop dua kolom dan mobile satu kolom
- [x] Styling semua komponen (tombol, slider, item playlist)
- [x] Animasi rotasi cover (dijeda secara default)

**Selesai bila:** halaman tampil rapi tanpa JS, responsif 360px-1920px.

## Fase 2: Fungsi Inti Player
- [x] `utils.js`: `formatTime`, `clamp`
- [x] `player.js`: load, play, pause, toggle
- [x] Next / Previous
- [x] Progress bar update + seek
- [x] Volume + mute (simpan di localStorage)
- [x] Auto-next saat lagu selesai
- [x] Penanganan error file audio

**Selesai bila:** semua fitur Must Have (F1-F5, F7) berfungsi.

## Fase 3: Playlist
- [x] `playlist.js`: render daftar dari data
- [x] Klik item → putar lagu
- [x] Tandai lagu aktif dan sinkron dengan next/prev
- [x] Tampilkan durasi tiap lagu setelah metadata dimuat

**Selesai bila:** F6 berfungsi dan highlight selalu sesuai lagu aktif.

## Fase 4: Visualizer
- [x] `visualizer.js`: `AudioContext`, `AnalyserNode`, `MediaElementSource` (sekali saja)
- [x] Gambar bar frekuensi di canvas dengan gradasi
- [x] Mulai/hentikan loop mengikuti status play/pause
- [x] Canvas menyesuaikan ukuran (devicePixelRatio, resize)
- [x] Fallback bila Web Audio tidak tersedia

**Selesai bila:** bar bergerak sinkron dengan musik, tidak ada suara ganda.

## Fase 5: Fitur Tambahan
- [x] Shuffle dan Repeat (off / all / one)
- [x] Dark/Light mode (simpan di localStorage)
- [x] Pencarian playlist
- [x] Keyboard shortcut (Spasi, ←, →)
- [x] Animasi transisi ganti lagu
- [x] Dukung `prefers-reduced-motion`

## Fase 6: Finalisasi
- [x] Ganti data placeholder dengan lagu dan cover asli (bebas hak cipta)
- [x] Uji di Chrome, Firefox, Edge, dan mobile
- [x] Periksa console: tanpa error/warning
- [x] Audit aksesibilitas dasar (aria-label, fokus, kontras)
- [x] Lengkapi `README.md`: deskripsi, cara menjalankan, fitur, sumber & lisensi aset, screenshot
- [x] Verifikasi seluruh kriteria penerimaan di `PRD.md`

## Prompt Awal untuk AI Agent
> Baca `AGENTS.md`, `PRD.md`, `ARCHITECTURE.md`, dan `DESIGN.md`. Lalu kerjakan **Fase 0 dan Fase 1** dari `TASKS.md`. Setelah selesai, ringkas hasilnya dan tunggu instruksi untuk fase berikutnya.
