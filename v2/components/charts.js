// components/charts.js — canvas-based charts (no library)

// BAR CHART
export function barChart(canvas, data, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const padding = { l: 60, r: 20, t: 20, b: 40 };
  const innerW = w - padding.l - padding.r;
  const innerH = h - padding.t - padding.b;
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = innerW / data.length;

  // axes
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.l, padding.t);
  ctx.lineTo(padding.l, padding.t + innerH);
  ctx.lineTo(padding.l + innerW, padding.t + innerH);
  ctx.stroke();

  // gridlines
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "11px ui-monospace, monospace";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i++) {
    const y = padding.t + innerH - (innerH / 4) * i;
    const val = Math.round((max / 4) * i);
    ctx.fillText(val, padding.l - 6, y + 4);
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.beginPath();
    ctx.moveTo(padding.l, y);
    ctx.lineTo(padding.l + innerW, y);
    ctx.stroke();
  }

  // bars
  data.forEach((d, i) => {
    const barH = (d.value / max) * innerH;
    const x = padding.l + barW * i + barW * 0.2;
    const y = padding.t + innerH - barH;
    const fill = opts.color || (d.color || "#f78166");
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, barW * 0.6, barH);

    // label
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText(d.label.slice(0, 8), x + barW * 0.3, padding.t + innerH + 14);
  });
}

// DONUT
export function donutChart(canvas, data, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) / 2 - 20;
  const inner = r * 0.6;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const palette = ["#f78166", "#7c9eff", "#62d68b", "#f5b942", "#c98bff", "#5dc3d6"];

  let start = -Math.PI / 2;
  data.forEach((d, i) => {
    const slice = (d.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + slice);
    ctx.closePath();
    ctx.fillStyle = palette[i % palette.length];
    ctx.fill();
    start += slice;
  });
  // inner cutout
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = opts.bg || "#0d1117";
  ctx.fill();

  // center label
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 24px ui-sans-serif, system-ui";
  ctx.textAlign = "center";
  ctx.fillText(opts.center || total, cx, cy);
  ctx.font = "11px ui-monospace, monospace";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText(opts.label || "TOTAL", cx, cy + 18);
}

// SPARKLINE
export function sparkline(canvas, data, opts = {}) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  if (!data || data.length < 2) return;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = w / (data.length - 1);

  ctx.strokeStyle = opts.color || "#f78166";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // fill area
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = (opts.color || "#f78166") + "22";
  ctx.fill();
}