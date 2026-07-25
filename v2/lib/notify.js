// lib/notify.js — toast notification system (pausable, role=status)

const STACK_ID = "toast-stack";
let timers = new WeakMap();

export function toast(kind, msg, opts = {}) {
  const { duration = 3500, action = null } = opts;
  const stack = document.getElementById(STACK_ID);
  if (!stack) return;

  const el = document.createElement("div");
  el.className = `toast ${kind}`;
  el.setAttribute("role", kind === "danger" ? "alert" : "status");
  el.innerHTML = `
    <span class="toast-msg">${escapeHTML(msg)}</span>
    ${action ? `<button class="btn btn-sm btn-ghost toast-action">${escapeHTML(action.label)}</button>` : ""}
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  let removed = false;
  const remove = () => {
    if (removed) return;
    removed = true;
    clearTimeout(timers.get(el));
    el.style.opacity = "0";
    el.style.transition = "opacity 200ms";
    setTimeout(() => el.remove(), 200);
  };

  if (action) {
    el.querySelector(".toast-action").addEventListener("click", () => {
      action.onClick?.();
      remove();
    });
  }
  el.querySelector(".toast-close").addEventListener("click", remove);

  // Pause on hover
  el.addEventListener("mouseenter", () => clearTimeout(timers.get(el)));
  el.addEventListener("mouseleave", () => {
    timers.set(el, setTimeout(remove, 1500));
  });

  stack.appendChild(el);
  timers.set(el, setTimeout(remove, duration));
}

function escapeHTML(s) {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const success = (msg, opts) => toast("success", msg, opts);
export const warning = (msg, opts) => toast("warning", msg, opts);
export const danger = (msg, opts) => toast("danger", msg, opts);
export const info = (msg, opts) => toast("info", msg, opts);
