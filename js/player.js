// Logika audio & kontrol. Satu elemen <audio>, tanpa Audio baru.
import { clamp } from "./utils.js";

const REPEAT_MODES = ["off", "all", "one"];

export function createPlayer(audioEl, tracks, { onError } = {}) {
  const state = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    repeatMode: "off",
    volume: 0.8,
    isMuted: false
  };

  const listeners = {};
  // Daftarkan callback event kustom.
  function on(event, fn) {
    (listeners[event] ??= []).push(fn);
  }
  // Kirim event kustom ke semua pendengar.
  function emit(event, data) {
    for (const fn of listeners[event] ?? []) fn(data);
  }

  // Muat lagu ke elemen audio.
  function loadTrack(index, { autoplay = false } = {}) {
    if (!tracks.length) return;
    state.currentIndex = (index + tracks.length) % tracks.length;
    audioEl.src = tracks[state.currentIndex].src;
    audioEl.load();
    emit("trackchange", { index: state.currentIndex, track: tracks[state.currentIndex] });
    if (autoplay) play().catch(() => {});
  }

  // Mainkan lagu aktif.
  async function play() {
    if (!tracks.length) return;
    if (!audioEl.src) loadTrack(state.currentIndex);
    await audioEl.play();
  }

  // Jeda pemutaran.
  function pause() {
    audioEl.pause();
  }

  // Toggle play/pause.
  function toggle() {
    if (state.isPlaying) pause();
    else play().catch(() => {});
  }

  // Lanjut ke lagu berikut (hormati shuffle).
  function next({ auto = false } = {}) {
    if (state.isShuffle && tracks.length > 1) {
      let i = state.currentIndex;
      while (i === state.currentIndex) i = Math.floor(Math.random() * tracks.length);
      loadTrack(i, { autoplay: true });
      return;
    }
    if (state.currentIndex === tracks.length - 1 && auto && state.repeatMode === "off") {
      state.isPlaying = false;
      emit("statechange", { ...state });
      emit("ended-playlist");
      return;
    }
    loadTrack(state.currentIndex + 1, { autoplay: true });
  }

  // Kembali ke lagu sebelumnya.
  function prev() {
    if (audioEl.currentTime > 3) {
      audioEl.currentTime = 0;
      return;
    }
    loadTrack(state.currentIndex - 1, { autoplay: true });
  }

  // Lompat ke posisi persen (0-1).
  function seek(percent) {
    if (!Number.isFinite(audioEl.duration)) return;
    audioEl.currentTime = clamp(percent, 0, 1) * audioEl.duration;
  }

  // Atur volume 0-1, simpan ke localStorage.
  function setVolume(value) {
    state.volume = clamp(value, 0, 1);
    audioEl.volume = state.volume;
    audioEl.muted = state.isMuted;
    try { localStorage.setItem("sismul-volume", String(state.volume)); } catch {}
    emit("statechange", { ...state });
  }

  // Toggle bisu.
  function toggleMute() {
    state.isMuted = !state.isMuted;
    audioEl.muted = state.isMuted;
    emit("statechange", { ...state });
  }

  // Toggle shuffle.
  function toggleShuffle() {
    state.isShuffle = !state.isShuffle;
    emit("statechange", { ...state });
  }

  // Putar mode repeat: off -> all -> one.
  function cycleRepeat() {
    const i = REPEAT_MODES.indexOf(state.repeatMode);
    state.repeatMode = REPEAT_MODES[(i + 1) % REPEAT_MODES.length];
    emit("statechange", { ...state });
  }

  audioEl.addEventListener("play", () => {
    state.isPlaying = true;
    emit("statechange", { ...state });
  });
  audioEl.addEventListener("pause", () => {
    state.isPlaying = false;
    emit("statechange", { ...state });
  });
  audioEl.addEventListener("ended", () => {
    if (state.repeatMode === "one") {
      audioEl.currentTime = 0;
      play().catch(() => {});
      return;
    }
    next({ auto: true });
  });
  audioEl.addEventListener("error", () => {
    // Beri pesan, lanjut ke lagu berikut bila ada.
    onError?.(tracks[state.currentIndex]);
    if (tracks.length > 1) loadTrack(state.currentIndex + 1, { autoplay: state.isPlaying });
  });

  try {
    const saved = parseFloat(localStorage.getItem("sismul-volume"));
    if (Number.isFinite(saved)) state.volume = clamp(saved, 0, 1);
  } catch {}
  audioEl.volume = state.volume;

  return {
    state, on, loadTrack, play, pause, toggle,
    next, prev, seek, setVolume, toggleMute,
    toggleShuffle, cycleRepeat
  };
}
