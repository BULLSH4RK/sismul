# DESIGN.md

## 1. Arah Visual
Modern, bersih, bernuansa gelap dengan aksen gradasi. Fokus pada cover album dan visualizer sebagai elemen utama. Hindari tampilan template generik.

## 2. Design Tokens (CSS Variables)
```css
:root {
  --bg: #222831;
  --surface: #393e46;
  --surface-hover: #404a5a;
  --text: #dfd0b8;
  --text-muted: #948979;
  --accent: #ff6d1f;
  --accent-2: #dfd0b8;
  --gradient: linear-gradient(135deg, var(--accent), var(--accent-2));
  --radius: 16px;
  --shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
  --font: "Poppins", system-ui, sans-serif;
}
[data-theme="light"] {
  --bg: #faf3e1;
  --surface: #ffffff;
  --surface-hover: #f5e7c6;
  --text: #222222;
  --text-muted: #6e6658;
  --accent: #ff6d1f;
  --accent-2: #ff8f4c;
  --gradient: linear-gradient(135deg, var(--accent), var(--accent-2));
  --shadow: 0 10px 30px rgba(34, 34, 34, 0.12);
}
```

## 3. Tipografi
- Font: Poppins (Google Fonts), fallback `system-ui`.
- Judul lagu: 24px / 600. Artis: 14px / 400 muted. Waktu: 12px tabular.

## 4. Layout

**Desktop (≥ 900px):** dua kolom
```
┌──────────────────────┬──────────────────┐
│  Cover (berputar)    │  Playlist        │
│  Judul / Artis       │  (scrollable)    │
│  Visualizer canvas   │                  │
│  Progress bar        │                  │
│  Kontrol + Volume    │                  │
└──────────────────────┴──────────────────┘
```

**Mobile (< 900px):** satu kolom; playlist di bawah player. Kontrol minimal 44x44px.

## 5. Komponen

| Komponen | Spesifikasi |
|---|---|
| Cover | Bulat 260px (desktop) / 200px (mobile), border gradasi, animasi `spin 12s linear infinite`, `animation-play-state` mengikuti status play |
| Visualizer | Canvas lebar penuh kartu, tinggi 120px, bar dengan gradasi `--gradient`, sudut membulat |
| Progress bar | Tinggi 6px, bagian terisi memakai gradasi, thumb muncul saat hover |
| Tombol utama (play) | Lingkaran 64px, latar gradasi, bayangan lembut, scale 1.08 saat hover |
| Tombol sekunder | Ikon SVG, warna muted, aktif = `--accent` |
| Item playlist | Thumbnail 48px, judul + artis, durasi di kanan; aktif: latar `--surface-hover` + garis aksen kiri + ikon equalizer mini |
| Toast | Muncul dari bawah, hilang otomatis 3 detik |

## 6. Animasi
- Transisi UI: `0.2s ease`.
- Ganti lagu: cover fade-out/in 300ms.
- Hormati `prefers-reduced-motion`: matikan rotasi cover dan transisi besar.

## 7. Ikon
SVG inline: play, pause, next, prev, shuffle, repeat, repeat-one, volume, mute, sun, moon, search. Ukuran 24px, `currentColor`.

## 8. Aksesibilitas
- Kontras teks minimal 4.5:1.
- Fokus terlihat: `outline: 2px solid var(--accent)`.
- `aria-label` pada semua tombol ikon; `aria-pressed` untuk shuffle/repeat.
- Slider memakai `<input type="range">` agar ramah keyboard.
