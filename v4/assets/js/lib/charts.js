// lib/charts.js — SVG chart primitives. No deps. Hue-bound to --chart-1..6 + --chart-grid/label tokens.
// Used by extras.js (leaderboard, KPI dimensi, pricing tiers) + views (KPI trend, vendor score history).

import { esc } from "./dom.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function svgEl(tag, attrs = {}, children = []) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) {
    if (attrs[k] != null) el.setAttribute(k, attrs[k]);
  }
  for (const c of children) {
    if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return el;
}

function tokenVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * barChart({ data, height=160, color: 1|2|3|4|5|6 = 1 })
 * data: [{ label, value, accent?: "success"|"warning"|"danger" }]
 * Returns SVGNode. Bars aligned to grid baseline; value labels above.
 */
export function barChart({ data = [], height = 160, color = 1 } = {}) {
  const w = 320;
  const pad = 24;
  const innerW = w - pad * 2;
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = (innerW / Math.max(data.length, 1)) * 0.7;
  const gap = (innerW / Math.max(data.length, 1)) - barW;
  const fill = `var(--chart-${color})`;

  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${height}`, width: "100%", height, role: "img" });
  // Grid
  for (let i = 0; i <= 3; i++) {
    const y = pad + ((height - pad * 2) / 3) * i;
    svg.appendChild(svgEl("line", { x1: pad, x2: w - pad, y1: y, y2: y, stroke: "var(--chart-grid)", "stroke-width": 1 }));
  }
  // Bars
  data.forEach((d, i) => {
    const x = pad + (innerW / data.length) * i + gap / 2;
    const h = (d.value / max) * (height - pad * 2);
    const y = height - pad - h;
    svg.appendChild(svgEl("rect", { x, y, width: barW, height: h, fill, rx: 4 }));
    svg.appendChild(svgEl("text", { x: x + barW / 2, y: y - 4, "text-anchor": "middle", "font-size": 10, fill: "var(--chart-label)" }, [String(d.value)]));
    svg.appendChild(svgEl("text", { x: x + barW / 2, y: height - pad + 12, "text-anchor": "middle", "font-size": 10, fill: "var(--chart-label)" }, [d.label]));
  });
  return svg;
}

/**
 * donutChart({ value, max=100, color=1, size=120 })
 * Returns SVGNode. Center value label.
 */
export function donutChart({ value = 0, max = 100, color = 1, size = 120, label = "" } = {}) {
  const r = size / 2 - 12;
  const cx = size / 2, cy = size / 2;
  const frac = Math.max(0, Math.min(1, value / max));
  const c = 2 * Math.PI * r;
  const filled = c * frac;
  const empty = c - filled;

  const svg = svgEl("svg", { viewBox: `0 0 ${size} ${size}`, width: size, height: size, role: "img" });
  svg.appendChild(svgEl("circle", { cx, cy, r, fill: "none", stroke: "var(--chart-grid)", "stroke-width": 10 }));
  svg.appendChild(svgEl("circle", {
    cx, cy, r, fill: "none",
    stroke: `var(--chart-${color})`,
    "stroke-width": 10,
    "stroke-dasharray": `${filled} ${empty}`,
    "stroke-linecap": "round",
    transform: `rotate(-90 ${cx} ${cy})`,
  }));
  svg.appendChild(svgEl("text", { x: cx, y: cy - 2, "text-anchor": "middle", "font-size": 22, "font-weight": 600, fill: "var(--color-text)", "font-family": "var(--font-display)" }, [`${value}`]));
  if (label) {
    svg.appendChild(svgEl("text", { x: cx, y: cy + 18, "text-anchor": "middle", "font-size": 11, fill: "var(--chart-label)" }, [label]));
  }
  return svg;
}

/**
 * lineChart({ data, height=160, color=1 })
 * data: [{ label, value }] — x = label order; y = value
 */
export function lineChart({ data = [], height = 160, color = 1 } = {}) {
  const w = 320;
  const pad = 24;
  const innerW = w - pad * 2, innerH = height - pad * 2;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = pad + (innerW / Math.max(data.length - 1, 1)) * i;
    const y = pad + (1 - (d.value - min) / range) * innerH;
    return [x, y];
  });
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");

  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${height}`, width: "100%", height, role: "img" });
  for (let i = 0; i <= 3; i++) {
    const y = pad + (innerH / 3) * i;
    svg.appendChild(svgEl("line", { x1: pad, x2: w - pad, y1: y, y2: y, stroke: "var(--chart-grid)", "stroke-width": 1 }));
  }
  // Area fill
  const areaD = `${pathD} L ${points[points.length - 1][0]} ${height - pad} L ${points[0][0]} ${height - pad} Z`;
  svg.appendChild(svgEl("path", { d: areaD, fill: `var(--chart-${color})`, "fill-opacity": 0.1 }));
  svg.appendChild(svgEl("path", { d: pathD, fill: "none", stroke: `var(--chart-${color})`, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));
  points.forEach(([x, y]) => {
    svg.appendChild(svgEl("circle", { cx: x, cy: y, r: 3, fill: `var(--chart-${color})` }));
  });
  return svg;
}

/**
 * gaugeChart({ value, max=100, color=1, size=140, label })
 * Half-circle gauge (start 180°, sweep 180°).
 */
export function gaugeChart({ value = 0, max = 100, color = 1, size = 140, label = "" } = {}) {
  const cx = size / 2;
  const cy = size * 0.7;
  const r = size * 0.42;
  const startAngle = Math.PI; // 180° at left
  const endAngle = 0;         // 0° at right
  const frac = Math.max(0, Math.min(1, value / max));
  const valueAngle = startAngle + (endAngle - startAngle) * frac;

  function arcPoint(angle) {
    return [cx + r * Math.cos(angle), cy - r * Math.sin(angle)];
  }
  function arcPath(start, end) {
    const [sx, sy] = arcPoint(start);
    const [ex, ey] = arcPoint(end);
    const large = (end - start) > Math.PI ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
  }

  const svg = svgEl("svg", { viewBox: `0 0 ${size} ${size * 0.85}`, width: size, height: size * 0.85, role: "img" });
  svg.appendChild(svgEl("path", { d: arcPath(startAngle, endAngle), fill: "none", stroke: "var(--chart-grid)", "stroke-width": 10, "stroke-linecap": "round" }));
  svg.appendChild(svgEl("path", { d: arcPath(startAngle, valueAngle), fill: "none", stroke: `var(--chart-${color})`, "stroke-width": 10, "stroke-linecap": "round" }));
  svg.appendChild(svgEl("text", { x: cx, y: cy - 4, "text-anchor": "middle", "font-size": 22, "font-weight": 600, fill: "var(--color-text)", "font-family": "var(--font-display)" }, [`${value}`]));
  if (label) {
    svg.appendChild(svgEl("text", { x: cx, y: cy + 14, "text-anchor": "middle", "font-size": 11, fill: "var(--chart-label)" }, [label]));
  }
  return svg;
}

/**
 * heatmap({ data, rows=24, cols=7, color=3 })
 * Grid of cells; data[y] = array of values for each column.
 * Used for posting cadence / call volume.
 */
export function heatmap({ data = [], rows = 24, cols = 7, color = 3 } = {}) {
  const cell = 14;
  const gap = 2;
  const w = cols * (cell + gap) + gap;
  const h = rows * (cell + gap) + gap;
  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${h}`, width: w, height: h, role: "img" });
  const fill = `var(--chart-${color})`;
  let max = 1;
  for (const row of data) for (const v of row) max = Math.max(max, v);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = data[y]?.[x] ?? 0;
      const opacity = v === 0 ? 0.06 : 0.25 + (v / max) * 0.7;
      svg.appendChild(svgEl("rect", {
        x: gap + x * (cell + gap),
        y: gap + y * (cell + gap),
        width: cell,
        height: cell,
        rx: 2,
        fill,
        "fill-opacity": opacity,
      }));
    }
  }
  return svg;
}

/**
 * sparkline(data, color=1, height=24) — compact line trend for KPI cards.
 */
export function sparkline(data = [], color = 1, height = 24) {
  if (!Array.isArray(data) || data.length < 2) return null;
  const w = 80;
  const pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = pad + (w - pad * 2) / (data.length - 1) * i;
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return [x, y];
  });
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  return svgEl("svg", { viewBox: `0 0 ${w} ${height}`, width: w, height, role: "presentation" }, [
    svgEl("path", { d, fill: "none", stroke: `var(--chart-${color})`, "stroke-width": 1.5, "stroke-linecap": "round", "stroke-linejoin": "round" }),
  ]);
}
