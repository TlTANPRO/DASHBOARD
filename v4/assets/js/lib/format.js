// lib/format.js — Intl IDR, dates, percentages.

export function formatIDR(n) {
  if (n == null || isNaN(n)) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n, { decimals = 0 } = {}) {
  if (n == null || isNaN(n)) return "—";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export function formatPercent(n, decimals = 0) {
  if (n == null || isNaN(n)) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n / 100);
}

export function formatDate(iso, { locale = "id-ID" } = {}) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

export function relativeTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "baru saja";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} menit lalu`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} jam lalu`;
  return `${Math.floor(diff / 86400_000)} hari lalu`;
}

export function initials(name) {
  if (!name) return "?";
  const parts = name.split(/[\s\/]+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}
