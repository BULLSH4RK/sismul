// Helper umum.

// Ubah detik jadi "m:ss".
export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Batasi nilai di rentang min-max.
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
