// views/fee.js — Fee closing breakdown
import { loadSSOT } from "../lib/api.js";
import { bentoCard } from "../components/card.js";
import { loadingSkeleton } from "../components/empty.js";
import { fmtIDR, escapeHTML } from "../lib/format.js";

export async function renderFee() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  const fee = await loadSSOT("bonus-scheme");
  const hpp = await loadSSOT("hpp-breakdown-73jt");

  if (!fee) {
    root.innerHTML = '<div class="empty"><div class="empty-title">Data fee belum tersedia</div></div>';
    return;
  }

  // Fee components (per spec README)
  const components = [
    { nama: "Yang Punya Pembeli", nominal: 1_250_000, penerima: "PIC pertama publikasi lead", icon: "🎯" },
    { nama: "Follow-up", nominal: 1_250_000, penerima: "PIC yang closing", icon: "📞" },
    { nama: "Media", nominal: 250_000, penerima: "Reni, Rifki, Reta (3 PIC, dibagi rata)", icon: "📱" },
    { nama: "Proyek", nominal: 250_000, penerima: "Rizal, Amir, Yudi, Sinta (4 PIC, dibagi rata)", icon: "🏗️" },
    { nama: "Pemberkasan", nominal: 250_000, penerima: "Novita atau siapa saja", icon: "📋" },
  ];

  const totalPerUnit = components.reduce((sum, c) => sum + c.nominal, 0);

  // Bonus tambahan
  const bonusTambahan = [
    { nama: "Mada", nominal: 500_000, syarat: "per unit terjual — semua divisi achieve + coaching 100%", icon: "👑" },
    { nama: "Bu Nisya", nominal: 500_000, syarat: "per bulan — legal tracking 100% + kontrak zero error + compliance 4x/thn", icon: "📜" },
  ];

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Fee Closing</h1>
        <p class="t-muted t-sm">Per unit closing — semua komponen bersyarat target divisi achieved</p>
      </div>
    </div>

    <div class="hero-stats mb-5">
      <div class="card">
        <div class="card-title">Total per Unit</div>
        <div class="card-value" style="color:var(--accent)">${fmtIDR(totalPerUnit)}</div>
        <div class="t-xs t-muted mt-2">5 komponen fee</div>
      </div>
      <div class="card">
        <div class="card-title">Q3 2026 Estimate</div>
        <div class="card-value">${fmtIDR(18 * totalPerUnit + 18 * 500_000 + 3 * 500_000)}</div>
        <div class="t-xs t-muted mt-2">18 unit × fee + bonus Mada + Bu Nisya (3 bln)</div>
      </div>
      <div class="card">
        <div class="card-title">Per PIC Range</div>
        <div class="card-value">${fmtIDR(250_000)} – ${fmtIDR(1_500_000)}</div>
        <div class="t-xs t-muted mt-2">Tergantung komponen & role</div>
      </div>
    </div>

    <h2 class="h-2 mb-3">5 Komponen Fee (per unit)</h2>
    <div class="bento mb-5">
      ${components
        .map(
          (c) => bentoCard({
            title: `${c.icon} ${escapeHTML(c.nama)}`,
            body: `
            <div class="card-value" style="color:var(--accent)">${fmtIDR(c.nominal)}</div>
            <div class="t-xs t-muted mt-2">${escapeHTML(c.penerima)}</div>
          `,
          })
        )
        .join("")}
    </div>

    <h2 class="h-2 mb-3">Bonus Tambahan (di LUAR fee)</h2>
    <div class="bento">
      ${bonusTambahan
        .map(
          (b) => bentoCard({
            title: `${b.icon} ${escapeHTML(b.nama)}`,
            body: `
            <div class="card-value" style="color:var(--success)">${fmtIDR(b.nominal)}</div>
            <div class="t-xs t-muted mt-2">Syarat: ${escapeHTML(b.syarat)}</div>
          `,
          })
        )
        .join("")}
    </div>

    <div class="card mt-5" style="background:var(--info-bg);border-color:var(--info)">
      <div class="row gap-2">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--info)" stroke-width="2" style="width:20px;height:20px;flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <div class="t-sm">
          <strong>PENTING:</strong> Tidak ada bonus tambahan PIC lain di luar komponen di atas.
          Semua fee dibayar <strong>hanya jika target divisi achieved</strong>.
          Detail lengkap di <code class="t-mono">buku-management-syahfalah-v1.0.docx</code> Section 2.2.
        </div>
      </div>
    </div>
  `;
}
