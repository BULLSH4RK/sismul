// Web Audio + Canvas visualizer. createMediaElementSource sekali saja.
export function createVisualizer(audioEl, canvasEl) {
  let ctx = null;
  let analyser = null;
  let data = null;
  let rafId = 0;
  let ready = false;

  // Siapkan AudioContext + Analyser setelah interaksi pengguna.
  function ensureGraph() {
    if (ready) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
      const src = ctx.createMediaElementSource(audioEl);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      src.connect(analyser);
      analyser.connect(ctx.destination);
      data = new Uint8Array(analyser.frequencyBinCount);
      ready = true;
      return true;
    } catch {
      return false;
    }
  }

  // Sesuaikan ukuran canvas dengan DPR dan lebar elemen.
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvasEl.clientWidth || 600;
    const h = 120;
    canvasEl.width = Math.floor(w * dpr);
    canvasEl.height = Math.floor(h * dpr);
  }

  // Gambar bar frekuensi dengan gradasi.
  function draw() {
    rafId = requestAnimationFrame(draw);
    const c = canvasEl.getContext("2d");
    const W = canvasEl.width;
    const H = canvasEl.height;
    c.clearRect(0, 0, W, H);
    if (!analyser) return;
    analyser.getByteFrequencyData(data);
    const bars = 48;
    const step = Math.floor(data.length / bars);
    const gap = W / bars;
    const light = document.documentElement.dataset.theme === "light";
    const grad = c.createLinearGradient(0, H, 0, 0);
    grad.addColorStop(0, "#ff6d1f");
    grad.addColorStop(1, light ? "#ff8f4c" : "#dfd0b8");
    c.fillStyle = grad;
    for (let i = 0; i < bars; i++) {
      const v = data[i * step] / 255;
      const h = Math.max(4, v * H * 0.92);
      const x = i * gap + gap * 0.2;
      const w = gap * 0.6;
      const y = H - h;
      if (typeof c.roundRect === "function") {
        c.beginPath();
        c.roundRect(x, y, w, h, Math.min(4, w / 2));
        c.fill();
      } else {
        c.fillRect(x, y, w, h);
      }
    }
  }

  // Mulai loop; resume context bila suspended.
  function start() {
    if (!ensureGraph()) {
      canvasEl.style.display = "none";
      return false;
    }
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    resize();
    if (!rafId) draw();
    return true;
  }

  // Hentikan loop agar hemat CPU.
  function stop() {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  window.addEventListener("resize", () => { if (rafId) resize(); });
  resize();

  return { start, stop, resize };
}
