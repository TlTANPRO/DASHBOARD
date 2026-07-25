// views/leaderboard.js — Ranking PIC by KPI achievement
import { API, loadSSOT } from "../lib/api.js";
import { loadingSkeleton } from "../components/empty.js";
import { rankPill } from "../components/pill.js";
import { fmtNum, fmtPct, escapeHTML, initials } from "../lib/format.js";

export async function renderLeaderboard() {
  const root = document.getElementById("view-root");
  root.innerHTML = loadingSkeleton(2);

  const [kpi, bonus] = await Promise.all([API.listKPI().catch(() => []), loadSSOT("bonus-scheme")]);

  // Hitung score per PIC
  const byPIC = {};
  kpi.forEach((r) => {
    const pic = r.PIC || r.pic;
    if (!pic) return;
    if (!byPIC[pic]) byPIC[pic] = { total: 0, achieved: 0, score: 0 };
    byPIC[pic].total++;
    const s = (r.Status || r.status || "").toLowerCase();
    const isAchieved = s.includes("achieve") || s.includes("done") || s.includes("selesai");
    if (isAchieved) {
      byPIC[pic].achieved++;
      byPIC[pic].score += 100;
    } else if (s.includes("progress")) {
      const t = Number(r.Target) || 0;
      const a = Number(r.Actual) || 0;
      if (t > 0) byPIC[pic].score += (a / t) * 70;
      else byPIC[pic].score += 30;
    }
  });

  const ranked = Object.entries(byPIC)
    .map(([pic, v]) => ({
      pic,
      ...v,
      rate: v.total > 0 ? (v.achieved / v.total) * 100 : 0,
    }))
    .sort((a, b) => b.score - a.score);

  const top3 = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  root.innerHTML = `
    <div class="row-between mb-4">
      <div>
        <h1 class="h-1">Leaderboard</h1>
        <p class="t-muted t-sm">Ranking PIC berdasarkan KPI achievement Q3 2026</p>
      </div>
    </div>

    ${
      top3.length >= 3
        ? `
      <div class="bento mb-5">
        ${top3
          .map(
            (p, i) => `
          <div class="card text-center" style="padding:var(--space-6)">
            ${rankPill(i + 1)}
            <div class="auth-pic-avatar mt-3" style="width:64px;height:64px;font-size:var(--text-xl);margin:0 auto">${initials(p.pic)}</div>
            <h3 class="h-2 mt-3">${escapeHTML(p.pic)}</h3>
            <div class="t-2xl tnum mt-2" style="font-weight:700;color:var(--accent)">${Math.round(p.score)}</div>
            <div class="t-xs t-muted">${fmtPct(p.rate, 0)} achieved (${p.achieved}/${p.total})</div>
          </div>
        `
          )
          .join("")}
      </div>
    `
        : ""
    }

    ${
      rest.length > 0
        ? `
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th style="width:60px">Rank</th>
              <th>PIC</th>
              <th class="num" style="text-align:right">Score</th>
              <th class="num" style="text-align:right">Achieved</th>
              <th class="num" style="text-align:right">Rate</th>
            </tr>
          </thead>
          <tbody>
            ${rest
              .map(
                (p, i) => `
              <tr>
                <td><span class="t-mono t-muted">#${i + 4}</span></td>
                <td>
                  <div class="row gap-2">
                    <div class="auth-pic-avatar" style="width:28px;height:28px;font-size:var(--text-xs)">${initials(p.pic)}</div>
                    <span style="font-weight:600">${escapeHTML(p.pic)}</span>
                  </div>
                </td>
                <td class="num" style="text-align:right;font-weight:600">${Math.round(p.score)}</td>
                <td class="num" style="text-align:right">${p.achieved}/${p.total}</td>
                <td class="num" style="text-align:right">${fmtPct(p.rate, 0)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
        : ""
    }

    ${
      ranked.length === 0
        ? '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 22V11a2 2 0 0 1 2-2 2 2 0 0 1 2 2v11M14 22v-5a2 2 0 0 1 2-2 2 2 0 0 1 2 2v5M6 22V8a2 2 0 0 1 2-2 2 2 0 0 1 2 2v14"/></svg><div class="empty-title">Belum ada data</div><div class="t-sm">Tambah KPI dulu di menu KPI</div></div>'
        : ""
    }
  `;
}
