// Render & state playlist dari data.
import { formatTime } from "./utils.js";

export function createPlaylist(listEl, { onSelect } = {}) {
  let items = [];

  // Buat satu baris lagu.
  function buildItem(track, index) {
    const li = document.createElement("li");
    li.className = "track";
    li.dataset.index = String(index);
    li.tabIndex = 0;
    li.setAttribute("role", "button");
    li.setAttribute("aria-label", `Putar ${track.title} oleh ${track.artist}`);

    const img = document.createElement("img");
    img.className = "track__thumb";
    img.src = track.cover;
    img.alt = "";
    img.width = 48;
    img.height = 48;
    img.loading = "lazy";

    const meta = document.createElement("div");
    meta.className = "track__meta";
    const title = document.createElement("p");
    title.className = "track__title";
    title.textContent = track.title;
    const artist = document.createElement("p");
    artist.className = "track__artist";
    artist.textContent = track.artist;
    meta.append(title, artist);

    const eq = document.createElement("span");
    eq.className = "track__eq";
    eq.setAttribute("aria-hidden", "true");
    eq.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));

    const dur = document.createElement("span");
    dur.className = "track__dur";
    dur.textContent = track.duration ? formatTime(track.duration) : "--:--";

    li.append(img, meta, eq, dur);
    li.addEventListener("click", () => onSelect?.(index));
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect?.(index); }
    });
    return li;
  }

  // Render ulang seluruh daftar.
  function render(tracks) {
    listEl.innerHTML = "";
    items = tracks.map((track, i) => {
      const li = buildItem(track, i);
      listEl.append(li);
      return li;
    });
    if (!tracks.length) {
      const empty = document.createElement("li");
      empty.className = "track";
      empty.textContent = "Playlist kosong.";
      listEl.append(empty);
    }
  }

  // Tandai lagu aktif.
  function setActive(index) {
    for (const li of items) li.classList.remove("track--active");
    items[index]?.classList.add("track--active");
    items[index]?.scrollIntoView({ block: "nearest" });
  }

  // Saring berdasarkan judul/artis.
  function filter(query) {
    const q = query.trim().toLowerCase();
    items.forEach((li, i) => {
      const t = li.querySelector(".track__title").textContent.toLowerCase();
      const a = li.querySelector(".track__artist").textContent.toLowerCase();
      li.style.display = !q || t.includes(q) || a.includes(q) ? "" : "none";
    });
  }

  // Perbarui durasi satu baris setelah metadata dimuat.
  function updateDuration(index, seconds) {
    const dur = items[index]?.querySelector(".track__dur");
    if (dur) dur.textContent = formatTime(seconds);
  }

  return { render, setActive, filter, updateDuration };
}
