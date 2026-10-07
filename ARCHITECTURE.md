# ARCHITECTURE.md

## 1. Gambaran Arsitektur
Aplikasi client-side murni. `main.js` menjadi penghubung antar modul; tiap modul punya satu tanggung jawab.

```
data/playlist.js ──► playlist.js ──► main.js ◄── player.js ──► <audio>
                                        │                        │
                                        └──► visualizer.js ◄─────┘
                                              (Web Audio + Canvas)
```

## 2. Model Data

### Track
```js
// data/playlist.js
export const tracks = [
  {
    id: 1,
    title: "Judul Lagu",
    artist: "Nama Artis",
    src: "assets/audio/lagu1.mp3",
    cover: "assets/images/cover1.jpg",
    duration: null // diisi saat metadata dimuat
  }
];
```

### State Aplikasi (di `player.js`)
```js
{
  currentIndex: 0,
  isPlaying: false,
  isShuffle: false,
  repeatMode: "off", // "off" | "all" | "one"
  volume: 0.8,
  isMuted: false
}
```

## 3. Modul dan Tanggung Jawab

### `utils.js`
- `formatTime(seconds)` → `"m:ss"`
- `clamp(value, min, max)`

### `player.js`
Membungkus elemen `<audio>`.
- `init(audioEl, tracks)`
- `loadTrack(index)`, `play()`, `pause()`, `toggle()`
- `next()`, `prev()` (menghormati shuffle & repeat)
- `seek(percent)`, `setVolume(value)`, `toggleMute()`
- `toggleShuffle()`, `cycleRepeat()`
- Emit event kustom: `trackchange`, `timeupdate`, `statechange`

Event audio yang dipakai: `loadedmetadata`, `timeupdate`, `ended`, `error`.

### `playlist.js`
- `render(tracks, container)` membuat daftar lagu
- `setActive(index)` menandai lagu aktif
- `filter(query)` (opsional, pencarian)
- Memanggil callback `onSelect(index)` saat item diklik

### `visualizer.js`
- `init(audioEl, canvasEl)` membuat `AudioContext`, `MediaElementSource`, `AnalyserNode`
- `start()` / `stop()` mengatur loop `requestAnimationFrame`
- `draw()` membaca `getByteFrequencyData` lalu menggambar bar
- Konfigurasi: `fftSize = 256`, `smoothingTimeConstant = 0.8`

### `main.js`
- Mengambil elemen DOM, memanggil `init` semua modul
- Menghubungkan event UI (klik, slider, keyboard) ke fungsi `player`
- Memperbarui UI (judul, cover, progress, ikon play/pause) saat menerima event dari `player`

## 4. Alur Penting

**Memutar lagu pertama kali**
1. Pengguna klik Play → `visualizer.resumeContext()` → `player.play()`
2. `statechange` → UI ganti ikon, cover mulai berputar, `visualizer.start()`

**Lagu selesai**
1. Event `ended` → cek `repeatMode`
2. `one`: ulang lagu sama; `all`/`off`: `next()`; jika `off` dan lagu terakhir → berhenti

**Seek**
1. Pengguna geser progress → `player.seek(percent)` → `audio.currentTime = percent * duration`

## 5. Keputusan Teknis
| Keputusan | Alasan |
|---|---|
| Vanilla JS + ES Modules | Sederhana, mudah dijelaskan di presentasi |
| Satu elemen `<audio>` | Mencegah suara ganda, kompatibel dengan Web Audio |
| Canvas 2D untuk visualizer | Cukup ringan, tidak perlu WebGL |
| `localStorage` hanya tema & volume | Menjaga state minimal |

## 6. Penanganan Error
- `audio.onerror` → tampilkan toast "Lagu gagal dimuat", lanjut ke lagu berikutnya.
- `AudioContext` tidak tersedia → sembunyikan canvas, player tetap berfungsi.
- Playlist kosong → tampilkan pesan kosong dan nonaktifkan kontrol.
