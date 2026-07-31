// lib/dom.js — Tiny virtual-node builder + class joiner.
// Replaces innerHTML template strings. Composes into DocumentFragment for batched DOM insert.
// Style: shadcn-inspired h() + cn() ergonomics. No deps.

/**
 * cn(...args) — class joiner. Filters truthy, joins spaces.
 * Usage: cn("card", isActive && "card--active", { "card--bold": bold })
 */
export function cn(...args) {
  const out = [];
  for (const a of args) {
    if (!a) continue;
    if (typeof a === "string" || typeof a === "number") {
      out.push(String(a));
    } else if (Array.isArray(a)) {
      const sub = cn(...a);
      if (sub) out.push(sub);
    } else if (typeof a === "object") {
      for (const k in a) {
        if (a[k]) out.push(k);
      }
    }
  }
  return out.join(" ");
}

/**
 * esc(s) — minimal HTML escape. For user-entered strings only.
 */
export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * h(tag, props, ...children) — create element with attributes/event listeners/children.
 * Children: string | number | Node | array.
 * Props: any HTML attribute or special key (class, dataset, on*, aria-*).
 */
export function h(tag, props = {}, ...children) {
  const isFrag = tag === Fragment;
  const el = isFrag ? document.createDocumentFragment() : document.createElement(tag);
  if (!isFrag && props) {
    for (const key in props) {
      const val = props[key];
      if (val == null || val === false) continue;
      if (key === "class" || key === "className") {
        const c = cn(val);
        if (c) el.className = (el.className ? el.className + " " : "") + c;
      } else if (key === "style" && typeof val === "object") {
        Object.assign(el.style, val);
      } else if (key === "dataset" && typeof val === "object") {
        Object.assign(el.dataset, val);
      } else if (key.startsWith("on") && typeof val === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), val);
      } else if (key === "html") {
        // explicit escape hatch for vetted inner content; prefer children
        el.innerHTML = val;
      } else if (key in el && typeof el[key] !== "function") {
        el[key] = val;
      } else {
        el.setAttribute(key, val === true ? "" : String(val));
      }
    }
  }
  appendChildren(el, children);
  return el;
}

function appendChildren(parent, children) {
  for (const c of children) {
    if (c == null || c === false) continue;
    if (typeof c === "string" || typeof c === "number") {
      parent.appendChild(document.createTextNode(String(c)));
    } else if (Array.isArray(c)) {
      appendChildren(parent, c);
    } else if (c instanceof Node) {
      parent.appendChild(c);
    }
  }
}

/** Fragment sentinel — wrap multiple siblings without an extra container. */
export const Fragment = Symbol("fragment");

/**
 * build(spec) — alternative: build element from declarative spec (no var assigned).
 * spec = { tag, props, children: [...] }
 */
export function build(spec) {
  if (!spec) return null;
  if (Array.isArray(spec)) return spec.map(build).filter(Boolean);
  if (typeof spec === "string") return document.createTextNode(spec);
  if (spec instanceof Node) return spec;
  return h(spec.tag || "div", spec.props, ...(spec.children || []));
}
