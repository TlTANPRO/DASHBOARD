// lib/keyboard.js — Global keyboard shortcuts. Cmd+K palette + g+{key} go + ? help.
// Activation: prefixes (g) require the key sequence; single keys are immediate (cmd/ctrl combos or ?).

const bindings = []; // { keys: string, fn, desc, scope }
const gPrefixQueue = { active: false, timer: null };

function resetGPrefix() {
  gPrefixQueue.active = false;
  if (gPrefixQueue.timer) clearTimeout(gPrefixQueue.timer);
  gPrefixQueue.timer = null;
}

/**
 * bind(keys, fn, desc, scope) — register a shortcut.
 * keys: "ctrl+k", "cmd+k", "g+o", "?", etc.
 */
export function bind(keys, fn, desc = "", scope = "app") {
  bindings.push({ keys: keys.toLowerCase(), fn, desc, scope });
}

function normalizeKey(e) {
  const parts = [];
  if (e.ctrlKey || e.metaKey) parts.push(e.ctrlKey ? "ctrl" : "cmd");
  const key = e.key.toLowerCase();
  if (key && key !== "control" && key !== "meta") parts.push(key);
  return parts.join("+");
}

function isInputFocused() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

function handler(e) {
  // Always allow Cmd/Ctrl combos
  const combo = normalizeKey(e);
  const inputFocused = isInputFocused();

  // 1) direct binding match (e.g. ctrl+k, ?, escape)
  for (const b of bindings) {
    if (b.keys === combo) {
      e.preventDefault();
      b.fn(e);
      resetGPrefix();
      return;
    }
  }

  // 2) g-prefix sequence (g + o, g + m, ...) — only when no input focused
  if (inputFocused) return;

  if (gPrefixQueue.active) {
    const seq = "g+" + combo;
    for (const b of bindings) {
      if (b.keys === seq) {
        e.preventDefault();
        b.fn(e);
        resetGPrefix();
        return;
      }
    }
    resetGPrefix();
    return;
  }

  if (combo === "g") {
    e.preventDefault();
    gPrefixQueue.active = true;
    gPrefixQueue.timer = setTimeout(resetGPrefix, 1200);
  }
}

let mounted = false;

/**
 * mountKeyboard() — install listener + default go-shortcuts.
 */
export function mountKeyboard() {
  if (mounted) return;
  mounted = true;
  document.addEventListener("keydown", handler);

  // Defaults
  bind("cmd+k", () => togglePalette(), "Buka pencarian global");
  bind("ctrl+k", () => togglePalette(), "Buka pencarian global");
  bind("g+o", () => navigate("/owner"), "Buka dashboard Owner");
  bind("g+m", () => navigate("/marketing"), "Buka Marketing");
  bind("g+l", () => navigate("/legal"), "Buka Legal");
  bind("g+a", () => navigate("/admin"), "Buka Administrasi");
  bind("g+p", () => navigate("/proyek"), "Buka Proyek");
  bind("g+c", () => navigate("/media"), "Buka Media");
  bind("?", () => openHelpPalette(), "Tampilkan pintasan");
  bind("escape", () => closeOverlays(), "Tutup dialog");
}

function navigate(path) {
  location.hash = "#" + path;
}

function togglePalette() {
  const el = document.getElementById("search-palette") || document.querySelector(".search-palette");
  if (!el) return;
  if (el.hidden) {
    el.hidden = false;
    const input = el.querySelector("input[type=search]");
    if (input) setTimeout(() => input.focus(), 50);
  } else {
    el.hidden = true;
  }
}

function closeOverlays() {
  const palette = document.querySelector(".search-palette");
  if (palette && !palette.hidden) { palette.hidden = true; return; }
  const modal = document.querySelector(".modal:not([hidden])");
  if (modal) modal.hidden = true;
}

function openHelpPalette() {
  let host = document.getElementById("shortcut-help");
  if (!host) {
    host = document.createElement("div");
    host.id = "shortcut-help";
    host.className = "shortcut-help";
    host.setAttribute("role", "dialog");
    host.setAttribute("aria-label", "Pintasan keyboard");
    host.addEventListener("click", (e) => { if (e.target === host) host.remove(); });
    document.body.appendChild(host);
  }
  const rows = bindings
    .slice()
    .filter((b, i, arr) => arr.findIndex((x) => x.keys === b.keys) === i)
    .map((b) => `<kbd>${esc(b.keys)}</kbd><span>${esc(b.desc)}</span>`)
    .join("");
  host.innerHTML = `
    <div class="shortcut-help__panel">
      <h2>Pintasan keyboard</h2>
      <dl class="shortcut-help__list">${rows}</dl>
      <p class="shortcut-help__hint">Tekan <kbd>esc</kbd> atau klik di luar untuk menutup</p>
    </div>`;
  host.classList.add("is-open");
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function listBindings() {
  return bindings.slice();
}
