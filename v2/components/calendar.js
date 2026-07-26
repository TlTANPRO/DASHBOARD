// components/calendar.js — monthly grid for Jobdesk

import { escapeHTML } from "../lib/format.js";

export function calendarView({ year, month, rows, dateField = "Tanggal", onDateClick = null }) {
  const y = year;
  const m = month; // 0-indexed
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  const startWeekday = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  // Group rows by date
  const byDate = {};
  rows.forEach((r) => {
    const d = r[dateField];
    if (!d) return;
    byDate[d] = byDate[d] || [];
    byDate[d].push(r);
  });

  // Build 6-week grid (max 42 cells)
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - startWeekday + 1;
    const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
    if (!inMonth) {
      cells.push({ empty: true });
      continue;
    }
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    cells.push({ dayNum, dateStr, items: byDate[dateStr] || [] });
  }

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const monthName = new Date(y, m, 1).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const header = `
    <div class="cal-head">
      <button class="btn btn-ghost btn-sm" data-cal-prev>←</button>
      <h3 class="cal-title">${escapeHTML(monthName)}</h3>
      <button class="btn btn-ghost btn-sm" data-cal-next>→</button>
    </div>
    <div class="cal-weekdays">${dayNames.map((d) => `<div class="cal-weekday">${d}</div>`).join("")}</div>
  `;

  const today = new Date().toISOString().split("T")[0];

  const grid = `
    <div class="cal-grid">
      ${cells
        .map((c) => {
          if (c.empty) return `<div class="cal-cell cal-empty"></div>`;
          const isToday = c.dateStr === today;
          const items = c.items
            .slice(0, 3)
            .map((r) => `<div class="cal-item" data-id="${escapeHTML(r.id)}">${escapeHTML(r.Aktivitas || r["Jobdesk ID"] || "—")}</div>`)
            .join("");
          const more = c.items.length > 3 ? `<div class="cal-more">+${c.items.length - 3} more</div>` : "";
          return `<div class="cal-cell${isToday ? " cal-today" : ""}" data-date="${c.dateStr}">
            <div class="cal-day-num">${c.dayNum}</div>
            ${items}
            ${more}
          </div>`;
        })
        .join("")}
    </div>
  `;

  return { html: `<div class="cal-wrap">${header}${grid}</div>`, year: y, month: m };
}