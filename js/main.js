// Inisialisasi dan penghubung modul.
import { tracks } from "../data/playlist.js";
import { createPlayer } from "./player.js";
import { createPlaylist } from "./playlist.js";
import { createVisualizer } from "./visualizer.js";
import { formatTime, clamp } from "./utils.js";

const $ = (id) => document.getElementById(id);
const audio = $("audio");
const cover = $("cover");
const trackTitle = $("trackTitle");
const trackArtist = $("trackArtist");
const playBtn = $("playBtn");
const iconPlay = $("iconPlay");
const iconPause = $("iconPause");
const prevBtn = $("prevBtn");
const nextBtn = $("nextBtn");
const seekEl = $("seek");
const currentTimeEl = $("currentTime");
const durationEl = $("duration");
const volumeEl = $("volume");
const muteBtn = $("muteBtn");
const shuffleBtn = $("shuffleBtn");
const repeatBtn = $("repeatBtn");
const searchEl = $("search");
const themeToggle = $("themeToggle");
const toast = $("toast");

let toastTimer;
// Tampilkan pesan singkat 3 detik.
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("toast--show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("toast--show"), 3000);
}

// Tema: baca simpanan, default gelap.
try {
  document.documentElement.dataset.theme = localStorage.getItem("sismul-theme") || "dark";
} catch {}
themeToggle.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem("sismul-theme", next); } catch {}
});

const player = createPlayer(audio, tracks, {
  onError: (track) => showToast(`Gagal memuat "${track?.title ?? "lagu"}", lanjut berikutnya`)
});
const visualizer = createVisualizer(audio, $("visualizer"));
const list = createPlaylist($("playlistList"), {
  onSelect: (index) => {
    visualizer.start();
    player.loadTrack(index, { autoplay: true });
  }
});

// Perbarui info lagu, cover, dan judul tab.
function renderTrack(index) {
  const track = tracks[index];
  if (!track) {
    trackTitle.textContent = "Tidak ada lagu";
    trackArtist.textContent = "—";
    return;
  }
  cover.style.opacity = "0";
  cover.src = track.cover;
  cover.alt = `Cover album ${track.title}`;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  document.title = `${track.title} — ${track.artist} | Sismul`;
  seekEl.value = "0";
  seekEl.style.background = "";
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = track.duration ? formatTime(track.duration) : "--:--";
  list.setActive(index);
}

cover.addEventListener("load", () => { cover.style.opacity = "1"; });
cover.addEventListener("error", () => { cover.style.opacity = "1"; });

// Perbarui ikon play/pause dan status body.
function renderState(state) {
  const playing = state.isPlaying;
  document.body.dataset.playing = String(playing);
  iconPlay.hidden = playing;
  iconPause.hidden = !playing;
  playBtn.setAttribute("aria-label", playing ? "Jeda" : "Putar");
  shuffleBtn.setAttribute("aria-pressed", String(state.isShuffle));
  repeatBtn.setAttribute("aria-pressed", String(state.repeatMode !== "off"));
  repeatBtn.setAttribute("aria-label", `Ulangi: ${state.repeatMode}`);
  repeatBtn.dataset.mode = state.repeatMode;
  if (playing) visualizer.start();
  else visualizer.stop();
}

player.on("trackchange", ({ index }) => renderTrack(index));
player.on("statechange", renderState);

// Kontrol dasar. Visualizer.start dulu agar AudioContext jalan dalam gesture klik.
playBtn.addEventListener("click", () => {
  visualizer.start();
  player.toggle();
});
nextBtn.addEventListener("click", () => player.next());
prevBtn.addEventListener("click", () => player.prev());
shuffleBtn.addEventListener("click", () => player.toggleShuffle());
repeatBtn.addEventListener("click", () => player.cycleRepeat());

// Progress: update tiap timeupdate, seek saat digeser.
audio.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audio.duration)) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  seekEl.value = String(pct);
  seekEl.style.background = `linear-gradient(90deg, var(--accent), var(--accent-2) ${pct}%, var(--surface-hover) ${pct}%)`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});
audio.addEventListener("loadedmetadata", () => {
  const i = player.state.currentIndex;
  tracks[i].duration = audio.duration;
  durationEl.textContent = formatTime(audio.duration);
  list.updateDuration(i, audio.duration);
});
seekEl.addEventListener("input", () => {
  player.seek(parseFloat(seekEl.value) / 100);
});

// Volume + mute.
volumeEl.value = String(clamp(player.state.volume, 0, 1));
volumeEl.addEventListener("input", () => {
  player.setVolume(parseFloat(volumeEl.value));
  muteBtn.setAttribute("aria-label", player.state.isMuted ? "Bunyikan" : "Bisukan");
});
muteBtn.addEventListener("click", () => {
  player.toggleMute();
  muteBtn.setAttribute("aria-label", player.state.isMuted ? "Bunyikan" : "Bisukan");
});

// Pencarian playlist.
searchEl.addEventListener("input", () => list.filter(searchEl.value));

// Shortcut: Spasi play/pause, panah pindah lagu.
document.addEventListener("keydown", (e) => {
  if (e.target.matches("input, textarea")) return;
  if (e.code === "Space") {
    e.preventDefault();
    visualizer.start();
    player.toggle();
  } else if (e.key === "ArrowRight") {
    player.next();
  } else if (e.key === "ArrowLeft") {
    player.prev();
  }
});

// Render awal. Jika playlist kosong, nonaktifkan kontrol.
list.render(tracks);
const hasTracks = tracks.length > 0;
playBtn.disabled = !hasTracks;
prevBtn.disabled = !hasTracks;
nextBtn.disabled = !hasTracks;
seekEl.disabled = !hasTracks;
if (hasTracks) player.loadTrack(0);
else {
  trackTitle.textContent = "Tidak ada lagu";
  trackArtist.textContent = "Tambahkan lagu di data/playlist.js";
}
renderState(player.state);
