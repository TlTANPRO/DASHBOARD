// views/pricing.js — Harga tier rumah
import { loadSSOT } from "../lib/api.js";
import { loadingSkeleton } from "../components/empty.js";
import { fmtIDR, escapeHTML } from "../lib/format.js";

export async function renderPricing() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  const [harga, hpp] = await Promise.all([loadSSOT("harga-tier"), loadSSOT("hpp-breakdown-73jt")]);

  if (!harga) {
    root.innerHTML = '<div class="empty"><div class="empty-title">Data harga belum tersedia</div></div>';
    return;
  }

  const tiers = Array.isArray(harga) ? harga : Object.entries(harga).map(([k, v]) => ({ nama: k, ...v }));

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Harga Tier Rumah</h1>
        <p class="t-muted t-sm">${tiers.length} tier tersedia</p>
      </div>
    </div>

    <div class="bento">
      ${tiers
        .map(
          (t) => `
        <div class="card">
          <div class="row-between mb-3">
            <div>
              <div class="t-xs uppercase t-muted">${escapeHTML(t.tipe || t.Tipe || "TIER")}</div>
              <h3 class="h-2 mt-1">${escapeHTML(t.nama || t.Nama || "—")}</h3>
            </div>
            <span class="pill pill-accent">${escapeHTML(t.channel || t.Channel || "Cash")}</span>
          </div>
          <div class="card-value" style="color:var(--accent)">${fmtIDR(t.harga || t.Harga || 0)}</div>
          <div class="t-xs t-muted mt-2">${escapeHTML(t.deskripsi || t.Deskripsi || "")}</div>
          ${
            t.luas
              ? `<div class="row gap-2 mt-3"><span class="t-sm t-muted">Luas:</span><span class="t-sm t-mono">${escapeHTML(String(t.luas))} m²</span></div>`
              : ""
          }
          ${
            t.kamar
              ? `<div class="row gap-2"><span class="t-sm t-muted">Kamar:</span><span class="t-sm t-mono">${escapeHTML(String(t.kamar))}</span></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>

    ${
      hpp
        ? `
      <div class="card mt-5">
        <h2 class="h-2 mb-3">HPP Breakdown (Type 36 contoh)</h2>
        <div class="row gap-3 mb-3">
          <div class="card-title">HPP/unit</div>
          <div class="card-value" style="color:var(--text-primary)">${fmtIDR(hpp.total || 73_000_000)}</div>
        </div>
        ${
          hpp.items
            ? `
          <table class="table">
            <thead><tr><th>Komponen</th><th class="num" style="text-align:right">Nominal</th><th class="num" style="text-align:right">%</th></tr></thead>
            <tbody>
              ${hpp.items
                .map(
                  (i) => `
                <tr>
                  <td>${escapeHTML(i.nama || i.Nama || "—")}</td>
                  <td class="num" style="text-align:right">${fmtIDR(i.nominal || 0)}</td>
                  <td class="num" style="text-align:right">${i.persentase || "—"}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `
            : ""
        }
      </div>
    `
        : ""
    }
  `;
}
