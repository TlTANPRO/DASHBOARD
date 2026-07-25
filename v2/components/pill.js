// components/pill.js — status badge
import { escapeHTML } from "../lib/format.js";

const KIND_MAP = {
  success: "pill-success",
  warning: "pill-warning",
  danger: "pill-danger",
  error: "pill-danger",
  info: "pill-info",
  muted: "pill-muted",
  neutral: "pill-muted",
  accent: "pill-accent",
  primary: "pill-accent",
};

export function pill(kind, text) {
  const cls = KIND_MAP[kind] || "pill-muted";
  return `<span class="pill ${cls}">${escapeHTML(text)}</span>`;
}

// Auto-detect kind from value
export function statusPill(status) {
  if (!status) return pill("muted", "—");
  const s = String(status).toLowerCase();
  if (["done", "selesai", "completed", "achieve", "achieved", "pass", "lulus", "✓"].some((k) => s.includes(k))) {
    return pill("success", status);
  }
  if (["progress", "in progress", "ongoing", "running", "active", "draft"].some((k) => s.includes(k))) {
    return pill("info", status);
  }
  if (["pending", "waiting", "review", "todo", "backlog", "queued"].some((k) => s.includes(k))) {
    return pill("warning", status);
  }
  if (["miss", "fail", "failed", "block", "blocked", "overdue", "late", "✗"].some((k) => s.includes(k))) {
    return pill("danger", status);
  }
  return pill("muted", status);
}

// Grade pill (gold/silver/bronze for leaderboard)
export function rankPill(rank) {
  if (rank === 1) return `<span class="pill" style="background:rgba(212,160,23,0.15);color:var(--gold);">🥇 #1</span>`;
  if (rank === 2) return `<span class="pill" style="background:rgba(177,186,196,0.15);color:var(--silver);">🥈 #2</span>`;
  if (rank === 3) return `<span class="pill" style="background:rgba(160,82,45,0.15);color:var(--bronze);">🥉 #3</span>`;
  return `<span class="pill pill-muted">#${rank}</span>`;
}
