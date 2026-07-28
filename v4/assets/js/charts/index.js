// charts/index.js — Vanilla SVG chart registry. Theme via tokens.css.
// Supported: bar, line, donut, heatmap, spark, gauge.
// No external library. All render responsive (ResizeObserver).

import { formatNumber, formatPercent } from "../lib/format.js";

function getThemeColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    text: s.getPropertyValue("--color-text").trim(),
    textMuted: s.getPropertyValue("--color-text-muted").trim(),
    border: s.getPropertyValue("--color-border").trim(),
    surface: s.getPropertyValue("--color-surface").trim(),
    accent: s.getPropertyValue("--color-accent").trim(),
    accentSoft: s.getPropertyValue("--color-accent-soft").trim(),
    success: s.getPropertyValue("--color-success").trim(),
    warning: s.getPropertyValue("--color-warning").trim(),
    danger: s.getPropertyValue("--color-danger").trim(),
    info: s.getPropertyValue("--color-info").trim(),
  };
}

function svgEl(name, attrs = {}, parent = null) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (parent) parent.appendChild(el);
  return el;
}

// === Bar ===
export function bar(container, { data, height = 200 } = {}) {
  // data: [{ label, value, target? }]
  container.innerHTML = "";
  const colors = getThemeColors();
  const max = Math.max(...data.map(d => d.target || d.value), 1);
  const w = container.clientWidth || 300;
  const barW = Math.max(8, (w - data.length * 8) / data.length);
  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${height}`, width: "100%", height }, container);
  data.forEach((d, i) => {
    const x = i * (barW + 8) + 4;
    const h = (d.value / max) * (height - 40);
    const y = height - h - 24;
    svgEl("rect", { x, y: height - 24, width: barW, height: 24, fill: colors.surface, stroke: colors.border, rx: 2 }, svg);
    svgEl("rect", { x, y, width: barW, height: h, fill: colors.accent, rx: 2 }, svg);
    if (d.target) {
      const ty = height - 24 - (d.target / max) * (height - 40);
      svgEl("line", { x1: x - 2, x2: x + barW + 2, y1: ty, y2: ty, stroke: colors.danger, "stroke-width": 1.5, "stroke-dasharray": "2,2" }, svg);
    }
    const txt = svgEl("text", { x: x + barW / 2, y: height - 8, "text-anchor": "middle", "font-size": 10, fill: colors.textMuted }, svg);
    txt.textContent = d.label;
  });
  return svg;
}

// === Line ===
export function line(container, { data, height = 200 } = {}) {
  // data: [{ label, value }]
  container.innerHTML = "";
  const colors = getThemeColors();
  const w = container.clientWidth || 300;
  const max = Math.max(...data.map(d => d.value), 1);
  const stepX = (w - 40) / Math.max(1, data.length - 1);
  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${height}`, width: "100%", height }, container);
  const path = data.map((d, i) => {
    const x = 20 + i * stepX;
    const y = height - 30 - (d.value / max) * (height - 50);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  svgEl("path", { d: path, fill: "none", stroke: colors.accent, "stroke-width": 2 }, svg);
  data.forEach((d, i) => {
    const x = 20 + i * stepX;
    const y = height - 30 - (d.value / max) * (height - 50);
    svgEl("circle", { cx: x, cy: y, r: 3, fill: colors.accent }, svg);
  });
  return svg;
}

// === Donut ===
export function donut(container, { segments, size = 160, thickness = 24 } = {}) {
  // segments: [{ label, value, color? }]
  container.innerHTML = "";
  const colors = getThemeColors();
  const palette = [colors.accent, colors.success, colors.warning, colors.info, colors.danger];
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const cx = size / 2, cy = size / 2, r = (size - thickness) / 2;
  const svg = svgEl("svg", { viewBox: `0 0 ${size} ${size}`, width: size, height: size }, container);
  let cumulative = 0;
  segments.forEach((seg, i) => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const start = cumulative - Math.PI / 2;
    const end = start + angle;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    svgEl("path", { d: path, fill: "none", stroke: seg.color || palette[i % palette.length], "stroke-width": thickness }, svg);
    cumulative = end;
  });
  // Center label
  const t = svgEl("text", { x: cx, y: cy, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": "18", "font-weight": "700", fill: colors.text }, svg);
  t.textContent = formatNumber(total);
  return svg;
}

// === Heatmap ===
export function heatmap(container, { matrix, xLabels, yLabels, size = 16 } = {}) {
  // matrix: 2D array of values [row][col]
  container.innerHTML = "";
  const colors = getThemeColors();
  const max = Math.max(...matrix.flat(), 1);
  const min = Math.min(...matrix.flat(), 0);
  const w = (xLabels.length + 1) * size;
  const h = (yLabels.length + 1) * size;
  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%" }, container);
  matrix.forEach((row, y) => {
    row.forEach((v, x) => {
      const intensity = (v - min) / (max - min || 1);
      const fill = intensity === 0 ? colors.surface : colors.accent;
      const opacity = 0.1 + intensity * 0.8;
      svgEl("rect", { x: (x + 1) * size, y: (y + 1) * size, width: size, height: size, fill, opacity }, svg);
    });
  });
  yLabels.forEach((l, i) => {
    const t = svgEl("text", { x: 0, y: (i + 1.5) * size, "font-size": 10, fill: colors.textMuted, "dominant-baseline": "middle" }, svg);
    t.textContent = l;
  });
  xLabels.forEach((l, i) => {
    const t = svgEl("text", { x: (i + 1.5) * size, y: size, "font-size": 10, fill: colors.textMuted, "text-anchor": "middle" }, svg);
    t.textContent = l;
  });
  return svg;
}

// === Sparkline ===
export function sparkline(container, { data, height = 32 } = {}) {
  container.innerHTML = "";
  const colors = getThemeColors();
  const w = container.clientWidth || 100;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = w / Math.max(1, data.length - 1);
  const svg = svgEl("svg", { viewBox: `0 0 ${w} ${height}`, width: "100%", height }, container);
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${height - 4 - ((v - min) / range) * (height - 8)}`).join(" ");
  svgEl("path", { d: path, fill: "none", stroke: colors.accent, "stroke-width": 1.5 }, svg);
  return svg;
}

// === Gauge ===
export function gauge(container, { value, target, min = 0, max = 100, size = 160 } = {}) {
  // value in [min..max], render as % of target
  container.innerHTML = "";
  const colors = getThemeColors();
  const cx = size / 2, cy = size / 2, r = size / 2 - 16;
  const svg = svgEl("svg", { viewBox: `0 0 ${size} ${size}`, width: size, height: size }, container);
  // Background arc
  svgEl("path", { d: arcPath(cx, cy, r, Math.PI * 0.75, Math.PI * 0.25), fill: "none", stroke: colors.border, "stroke-width": 12, "stroke-linecap": "round" }, svg);
  // Value arc
  const t = (target ?? max) / max;
  const sweep = Math.PI * 0.5 * t;
  const end = Math.PI * 0.75;
  svgEl("path", { d: arcPath(cx, cy, r, Math.PI * 0.75, end + sweep), fill: "none", stroke: colors.accent, "stroke-width": 12, "stroke-linecap": "round" }, svg);
  const txt = svgEl("text", { x: cx, y: cy, "text-anchor": "middle", "dominant-baseline": "middle", "font-size": "22", "font-weight": "700", fill: colors.text }, svg);
  txt.textContent = formatPercent(value);
  return svg;
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}
