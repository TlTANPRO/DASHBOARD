// lib/format.js — formatters (IDR, date, percent, truncate)

export const fmtIDR = (n) => {
  if (n == null || isNaN(n)) return "—";
  return "Rp " + Math.round(Number(n)).toLocaleString("id-ID");
};

export const fmtIDRShort = (n) => {
  if (n == null || isNaN(n)) return "—";
  const num = Number(n);
  if (Math.abs(num) >= 1e9) return "Rp " + (num / 1e9).toFixed(1) + " M";
  if (Math.abs(num) >= 1e6) return "Rp " + (num / 1e6).toFixed(1) + " jt";
  if (Math.abs(num) >= 1e3) return "Rp " + (num / 1e3).toFixed(0) + " rb";
  return "Rp " + num;
};

export const fmtNum = (n, digits = 0) => {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toLocaleString("id-ID", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
};

export const fmtPct = (n, digits = 1) => {
  if (n == null || isNaN(n)) return "—";
  return Number(n).toFixed(digits) + "%";
};

export const fmtDate = (d) => {
  if (!d) return "—";
  const dt = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dt)) return "—";
  return dt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

export const fmtDateISO = (d = new Date()) => {
  return new Date(d).toISOString().split("T")[0];
};

export const truncate = (s, n = 50) => {
  if (!s) return "";
  const str = String(s);
  return str.length > n ? str.slice(0, n) + "…" : str;
};

export const escapeHTML = (s) => {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

export const initials = (name) => {
  if (!name) return "??";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
