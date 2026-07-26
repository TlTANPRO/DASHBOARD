# Design Language: Twenty | #1 Open Source CRM

> Extracted from `https://twenty.com/` on July 26, 2026
> 3963 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#ff5f57` | rgb(255, 95, 87) | hsl(3, 100%, 67%) | 2 |
| Secondary | `#febc2e` | rgb(254, 188, 46) | hsl(41, 99%, 59%) | 2 |
| Accent | `#28c840` | rgb(40, 200, 64) | hsl(129, 67%, 47%) | 2 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#1c1c1c` | hsl(0, 0%, 11%) | 3502 |
| `#000000` | hsl(0, 0%, 0%) | 949 |
| `#999999` | hsl(0, 0%, 60%) | 496 |
| `#ffffff` | hsl(0, 0%, 100%) | 488 |
| `#666666` | hsl(0, 0%, 40%) | 70 |
| `#333333` | hsl(0, 0%, 20%) | 60 |
| `#09090b` | hsl(240, 10%, 4%) | 28 |
| `#4b5563` | hsl(215, 14%, 34%) | 24 |
| `#b3b3b3` | hsl(0, 0%, 70%) | 22 |
| `#e5e7eb` | hsl(220, 13%, 91%) | 14 |
| `#dddddd` | hsl(0, 0%, 87%) | 8 |
| `#ffe4e6` | hsl(356, 100%, 95%) | 4 |

### Background Colors

Used on large-area elements: `#ffffff`, `#f4f4f4`, `#1c1c1c`, `#424242`, `#f5f5f3`, `#1b1b1b`, `#111111`

### Text Colors

Text color palette: `#000000`, `#1c1c1c`, `#0000ee`, `#4a38f5`, `#ffffff`, `#28241e`, `#09090b`, `#377e5d`, `#a94a4f`, `#2f7468`

### Gradients

```css
background-image: radial-gradient(80% 60% at 50% 40%, rgba(245, 243, 240, 0.6) 0%, rgba(0, 0, 0, 0) 70%);
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#1c1c1c` | text, border, background | 3502 |
| `#000000` | text, border, background | 949 |
| `#999999` | text, border | 496 |
| `#ffffff` | background, text, border | 488 |
| `#0000ee` | text, border | 260 |
| `#4a38f5` | text, border, background | 102 |
| `#0550ae` | text, border | 82 |
| `#666666` | text, border | 70 |
| `#333333` | background, text, border | 60 |
| `#0a3069` | text, border | 60 |
| `#eaf4ed` | background, border | 53 |
| `#1961ed` | background, text, border | 51 |
| `#82be9c` | background | 40 |
| `#09090b` | background, border, text | 28 |
| `#2f7468` | text, border | 28 |
| `#953800` | text, border | 28 |
| `#8250df` | text, border | 26 |
| `#4b5563` | text, border | 24 |
| `#b3b3b3` | background, text, border | 22 |
| `#377e5d` | text, border | 14 |
| `#a94a4f` | text, border | 14 |
| `#e5e7eb` | border, background | 14 |
| `#be123c` | text, border | 12 |
| `#18794e` | text, border | 10 |
| `#dddddd` | border | 8 |
| `#6d28d9` | text, border | 8 |
| `#ddf3e4` | background | 5 |
| `#ffe4e6` | background | 4 |
| `#7a4f2a` | text, border | 4 |
| `#1d4ed8` | text, border | 4 |

## Typography

### Font Families

- **Host Grotesk** — used for all (2499 elements)
- **inter** — used for body (474 elements)
- **Geist Mono** — used for body (353 elements)
- **Azeret Mono** — used for body (208 elements)
- **Inter** — used for body (190 elements)
- **Arial** — used for body (120 elements)
- **Times New Roman** — used for body (107 elements)
- **Aleo** — used for headings (9 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 80px | 5rem | 300 | 86px | -1.6px | h2, span |
| 60px | 3.75rem | 300 | 66px | -1.2px | h1, span, h2, h3 |
| 48px | 3rem | 300 | 56px | -0.96px | h2, span, p |
| 32px | 2rem | 400 | 40px | normal | span |
| 22px | 1.375rem | 500 | 28px | normal | h3 |
| 20px | 1.25rem | 500 | 17.011px | normal | span |
| 18.72px | 1.17rem | 700 | normal | normal | h3, button, span, svg |
| 18px | 1.125rem | 500 | 24px | -0.72px | p, span |
| 16px | 1rem | 400 | normal | normal | html, head, meta, link |
| 15px | 0.9375rem | 600 | normal | -0.3px | span |
| 13.3333px | 0.8333rem | 400 | normal | normal | button, svg, path, div |
| 13px | 0.8125rem | 500 | 18.2px | normal | span, div, svg, path |
| 12px | 0.75rem | 500 | normal | normal | a, button, span, svg |
| 11.95px | 0.7469rem | 500 | 16.73px | normal | span |
| 11px | 0.6875rem | 600 | 11px | normal | span, div |

### Heading Scale

```css
h2 { font-size: 80px; font-weight: 300; line-height: 86px; }
h1 { font-size: 60px; font-weight: 300; line-height: 66px; }
h2 { font-size: 48px; font-weight: 300; line-height: 56px; }
h3 { font-size: 22px; font-weight: 500; line-height: 28px; }
h3 { font-size: 18.72px; font-weight: 700; line-height: normal; }
h3 { font-size: 16px; font-weight: 400; line-height: normal; }
```

### Body Text

```css
body { font-size: 12px; font-weight: 500; line-height: normal; }
```

### Font Weights in Use

`400` (3262x), `500` (554x), `700` (91x), `600` (33x), `300` (23x)

## Spacing

**Base unit:** 4px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-19 | 19px | 1.1875rem |
| spacing-24 | 24px | 1.5rem |
| spacing-28 | 28px | 1.75rem |
| spacing-40 | 40px | 2.5rem |
| spacing-48 | 48px | 3rem |
| spacing-60 | 60px | 3.75rem |
| spacing-64 | 64px | 4rem |
| spacing-68 | 68px | 4.25rem |
| spacing-80 | 80px | 5rem |
| spacing-120 | 120px | 7.5rem |
| spacing-160 | 160px | 10rem |
| spacing-208 | 208px | 13rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| xs | 1px | 34 |
| sm | 4px | 267 |
| md | 7px | 1 |
| lg | 16px | 5 |
| xl | 20px | 2 |
| full | 50px | 58 |
| full | 56px | 1 |
| full | 999px | 57 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.12) 0px 1px 2px 0px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(255, 255, 255, 0.6) 0px 0px 0px 1px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(241, 241, 241, 0.9) 0px 0px 0px 1px;
```

**sm (inset)** — blur: 0px
```css
box-shadow: rgb(221, 243, 228) 0px 0px 0px 1px inset;
```

**sm** — blur: 0px
```css
box-shadow: rgba(255, 255, 255, 0.16) 0px 0px 0px 1px, rgba(0, 0, 0, 0.28) 0px 20px 48px 0px;
```

**xs (inset)** — blur: 0px
```css
box-shadow: rgba(255, 255, 255, 0.65) 0px 1px 0px 0px inset;
```

**xs** — blur: 1px
```css
box-shadow: rgba(0, 0, 0, 0.04) 0px 0px 1px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
```

**sm** — blur: 3.677px
```css
box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 3.677px 0px, rgba(0, 0, 0, 0.04) 0px 1.839px 3.677px 0px;
```

**sm** — blur: 4px
```css
box-shadow: color(display-p3 0 0 0 / 0.039) 0px 2px 4px 0px, color(display-p3 0 0 0 / 0.078) 0px 0px 4px 0px;
```

**xl** — blur: 64px
```css
box-shadow: rgba(0, 0, 0, 0.2) 0px 10px 64px 0px;
```

## CSS Custom Properties

### Colors

```css
--color-white: #fff;
--color-black: #1c1c1c;
--color-black-hover: #333;
--color-white-hover: #e8e8e8;
--color-graphite: #424242;
--color-silver: #dbdbdb;
--color-neutral: #f4f4f4;
--color-blue: #4a38f5;
--color-pink: #ed87fc;
--color-green: #89fc9a;
--color-yellow: #feffb7;
--color-error: #ff9a9a;
--color-ash: #bababa;
--color-fog: #ddd;
--color-charcoal: #2a2a2a;
--color-stone: #959595;
--color-iron: #777;
--color-chalk: #f3f3f3;
--color-black-5: #1c1c1c0d;
--color-black-10: #1c1c1c1a;
--color-black-20: #1c1c1c33;
--color-black-40: #1c1c1c66;
--color-black-60: #1c1c1c99;
--color-black-70: #1c1c1cb3;
--color-black-80: #1c1c1ccc;
--color-blue-5: #4a38f50d;
--color-blue-10: #4a38f51a;
--color-blue-20: #4a38f533;
--color-blue-40: #4a38f566;
--color-blue-60: #4a38f599;
--color-blue-70: #4a38f5b3;
--color-blue-80: #4a38f5cc;
--color-white-5: #ffffff0d;
--color-white-10: #ffffff1a;
--color-white-20: #fff3;
--color-white-40: #fff6;
--color-white-60: #fff9;
--color-white-70: #ffffffb3;
--color-white-80: #fffc;
--ink-muted: var(--color-black-60);
```

### Spacing

```css
--spacing-base: 4px;
```

### Typography

```css
--font-base: .25rem;
```

### Radii

```css
--radius-base: 2px;
```

### Other

```css
--surface: var(--color-white);
--ink: var(--color-black);
--ink-subtle: var(--color-black-40);
--line: var(--color-black-10);
--line-strong: var(--color-black-20);
--divider: var(--color-black-40);
```

### Dependencies

```css
--surface: --color-white;
--ink: --color-black;
--ink-muted: --color-black-60;
--ink-subtle: --color-black-40;
--line: --color-black-10;
--line-strong: --color-black-20;
--divider: --color-black-40;
```

### Semantic

```css
success: [object Object];
warning: [object Object];
error: [object Object];
info: [object Object];
```

## Breakpoints

| Name | Value | Type |
|------|-------|------|
| 921px | 921px | min-width |
| xl | 1281px | min-width |
| 1350px | 1350px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`, `[object Object]`, `[object Object]`, `[object Object]`, `[object Object]`, `[object Object]`, `[object Object]`

**Durations:** `0.3s`, `0.2s`, `0.24s`, `0.26s`, `0.22s`, `0.6s`, `0.1s`, `0.12s`, `0.14s`, `0.16s`, `0.42s`, `0.18s`, `0.32s`, `0.4s`, `0.15s`, `0.52s`, `0.62s`, `0.28s`, `0.34s`, `0.5s`

### Common Transitions

```css
transition: all;
transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
transition: fill 0.3s cubic-bezier(0.16, 1, 0.3, 1);
transition: color 0.2s cubic-bezier(0.16, 1, 0.3, 1);
transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
transition: stroke 0.3s cubic-bezier(0.16, 1, 0.3, 1);
transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
transition: color 0.22s;
transition: opacity 0.6s;
```

### Keyframe Animations

**employees-filter-pop-away-f1e4yxld**
```css
@keyframes employees-filter-pop-away-f1e4yxld {
  0% { opacity: 1; transform: scale(0.985) translate(0px, 0px); }
  36% { opacity: 1; transform: scale(1.08) translate(2px, -1px); }
  100% { opacity: 0; transform: scale(0.64) translate(18px, -6px); }
}
```

**activityRowAppear-ahjetg7**
```css
@keyframes activityRowAppear-ahjetg7 {
  0% { opacity: 0; transform: translateY(-2px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**calendarDayAppear-c46w6ud**
```css
@keyframes calendarDayAppear-c46w6ud {
  0% { opacity: 0; transform: translateY(-2px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**noteCardAppear-nr8ljmy**
```css
@keyframes noteCardAppear-nr8ljmy {
  0% { opacity: 0; transform: translateY(-2px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**timelineRowAppear-t1st48gb**
```css
@keyframes timelineRowAppear-t1st48gb {
  0% { opacity: 0; transform: translateY(-2px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**recordHeaderAppear-rhq2y5x**
```css
@keyframes recordHeaderAppear-rhq2y5x {
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**fieldRowAppear-feiz1zg**
```css
@keyframes fieldRowAppear-feiz1zg {
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**relationAppear-r6u99lo**
```css
@keyframes relationAppear-r6u99lo {
  0% { opacity: 0; transform: translateY(6px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**tabBarAppear-t19vfz6v**
```css
@keyframes tabBarAppear-t19vfz6v {
  0% { opacity: 0; transform: translateY(-2px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

**tableHeaderAppear-h1tkdw5w**
```css
@keyframes tableHeaderAppear-h1tkdw5w {
  0% { opacity: 0; transform: translateY(-2px); }
  100% { opacity: 1; transform: translateY(0px); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (41 instances)

```css
.button {
  background-color: rgb(255, 95, 87);
  color: rgb(0, 0, 0);
  font-size: 13.3333px;
  font-weight: 400;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 4px;
}
```

### Cards (71 instances)

```css
.card {
  background-color: color(display-p3 1 1 1 / 0.5);
  border-radius: 4px;
  box-shadow: color(display-p3 0 0 0 / 0.039) 0px 2px 4px 0px, color(display-p3 0 0 0 / 0.078) 0px 0px 4px 0px;
  padding-top: 0px;
  padding-right: 4px;
}
```

### Links (36 instances)

```css
.link {
  color: rgb(28, 28, 28);
  font-size: 16px;
  font-weight: 400;
}
```

### Navigation (4 instances)

```css
.navigatio {
  color: rgb(28, 28, 28);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Footer (4 instances)

```css
.foote {
  background-color: rgb(28, 28, 28);
  color: rgb(28, 28, 28);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 16px;
}
```

### Dropdowns (1 instances)

```css
.dropdown {
  border-radius: 0px;
  border-color: rgb(28, 28, 28);
  padding-top: 0px;
}
```

### Tabs (2 instances)

```css
.tab {
  background-color: rgb(255, 255, 255);
  color: rgba(9, 9, 11, 0.55);
  font-size: 13px;
  font-weight: 500;
  padding-top: 0px;
  padding-right: 8px;
  border-color: rgba(9, 9, 11, 0.06);
  border-radius: 6px;
}
```

### ProgressBars (4 instances)

```css
.progressBar {
  color: rgb(153, 153, 153);
  border-radius: 0px;
  font-size: 16px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(0, 0, 238);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(0, 0, 238);
  font-size: 16px;
  font-weight: 400;
```

### Button — 2 instances, 2 variants

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(28, 28, 28);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(28, 28, 28);
  font-size: 12px;
  font-weight: 500;
```

**Variant 2** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(153, 153, 153);
  padding: 0px 8px 0px 8px;
  border-radius: 4px;
  border: 0px none rgb(153, 153, 153);
  font-size: 13px;
  font-weight: 400;
```

### Button — 10 instances, 2 variants

**Variant 1** (3 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(0, 0, 0);
  padding: 0px 20px 0px 20px;
  border-radius: 0px;
  border: 0px none rgb(0, 0, 0);
  font-size: 12px;
  font-weight: 500;
```

**Variant 2** (7 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(255, 255, 255);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(255, 255, 255);
  font-size: 18.72px;
  font-weight: 700;
```

### Button — 7 instances, 4 variants

**Variant 1** (3 instances)

```css
  background: rgb(255, 95, 87);
  color: rgb(0, 0, 0);
  padding: 0px 0px 0px 0px;
  border-radius: 999px;
  border: 0px none rgb(0, 0, 0);
  font-size: 13.3333px;
  font-weight: 400;
```

**Variant 2** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(25, 97, 237);
  padding: 0px 0px 0px 0px;
  border-radius: 2px;
  border: 0px none rgb(25, 97, 237);
  font-size: 13.3333px;
  font-weight: 400;
```

**Variant 3** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgba(28, 28, 28, 0.2);
  padding: 0px 0px 0px 0px;
  border-radius: 4px;
  border: 1px solid rgba(28, 28, 28, 0.1);
  font-size: 13.3333px;
  font-weight: 400;
```

**Variant 4** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(28, 28, 28);
  padding: 0px 0px 0px 0px;
  border-radius: 4px;
  border: 1px solid rgba(28, 28, 28, 0.2);
  font-size: 13.3333px;
  font-weight: 400;
```

### Button — 8 instances, 1 variant

**Variant 1** (8 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(0, 0, 0);
  padding: 0px 2px 0px 4px;
  border-radius: 4px;
  border: 0px none rgb(0, 0, 0);
  font-size: 13.3333px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(0, 0, 0);
  padding: 0px 2px 0px 4px;
  border-radius: 4px;
  border: 0px none rgb(0, 0, 0);
  font-size: 13.3333px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(28, 28, 28);
  padding: 8px 12px 8px 12px;
  border-radius: 2px;
  border: 1px solid rgba(28, 28, 28, 0.2);
  font-size: 12px;
  font-weight: 500;
```

## Layout System

**109 grid containers** and **1419 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1512px | 40px |
| 454px | 0px |
| 921px | 0px |
| 672px | 0px |
| 100% | 0px |
| 900px | 0px |
| 688px | 16px |
| 443px | 16px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 1-column | 54x |
| 7-column | 16x |
| 3-column | 16x |
| 2-column | 12x |
| 5-column | 7x |
| 4-column | 3x |

### Grid Templates

```css
grid-template-columns: 580px 580px;
gap: 48px 40px;
grid-template-columns: 1200px;
grid-template-columns: 580px;
grid-template-columns: 1200px;
grid-template-columns: 1200px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 1361x |
| column/nowrap | 54x |
| row/wrap | 4x |

**Gap values:** `0px 60px`, `0px normal`, `1.839px`, `10px`, `12px`, `12px normal`, `16px`, `16px 8px`, `16px normal`, `1px`, `20px`, `20px 24px`, `24px`, `2px`, `2px normal`, `3.677px`, `48px 16px`, `48px 40px`, `4px`, `4px normal`, `56px normal`, `6px`, `80px`, `8px`, `normal 20px`, `normal 2px`, `normal 32px`, `normal 4px`, `normal 8px`

## Accessibility (WCAG 2.1)

**Overall Score: 67%** — 4 passing, 2 failing color pairs

### Failing Color Pairs

| Foreground | Background | Ratio | Level | Used On |
|------------|------------|-------|-------|---------|
| `#d6409f` | `#fce5f3` | 3.46:1 | FAIL | span (1x) |
| `#8e4ec6` | `#ede9fe` | 4.36:1 | FAIL | span (1x) |

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#4b5563` | `#e5e7eb` | 6.1:1 | AA |
| `#09090b` | `#ffffff` | 19.9:1 | AAA |
| `#35290f` | `#fef2a4` | 12.51:1 | AAA |

## Design System Score

**Overall: 74/100 (Grade: C)**

| Category | Score |
|----------|-------|
| Color Discipline | 65/100 |
| Typography Consistency | 50/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 90/100 |
| Border Radius Consistency | 80/100 |
| Accessibility | 67/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Well-defined spacing scale, Clean elevation system, Good CSS variable tokenization

**Issues:**
- 8 font families — consider limiting to 2 (heading + body)
- 2 WCAG contrast failures
- 54% of CSS is unused — consider purging
- 3817 duplicate CSS declarations

## Gradients

**1 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| radial | — | 3 | bold |

```css
background: radial-gradient(80% 60% at 50% 40%, rgba(245, 243, 240, 0.6) 0%, rgba(0, 0, 0, 0) 70%);
```

## Z-Index Map

**14 unique z-index values** across 3 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| dropdown | 200,200 | header.h.1.v.l.x.f.p.f |
| sticky | 10,12 | div.m.1.2.7.p.h.2.o, div.c.u.l.w.7.e.3, div.c.u.l.w.7.e.3 |
| base | -1,9 | div, div, div |

## SVG Icons

**108 unique SVG icons** detected. Dominant style: **outlined**.

| Size Class | Count |
|------------|-------|
| xs | 71 |
| sm | 25 |
| md | 2 |
| lg | 4 |
| xl | 6 |

**Icon colors:** `var(--ink)`, `var(--surface)`, `currentColor`, `true`, `rgb(0, 0, 0)`, `rgba(0, 0, 0, 0.55)`, `#75bd21`, `#ffc728`, `#ff661c`, `#cf0f2b`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Host Grotesk | self-hosted | 300, 400, 500, 600 | normal |
| Aleo | self-hosted | 300 | normal |
| Azeret Mono | self-hosted | 300, 500 | normal |
| VT323 | self-hosted | 400 | normal |
| inter | self-hosted | 400, 500, 600 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 81 | objectFit: contain, borderRadius: 0px, shape: square |

**Aspect ratios:** 1:1 (73x), 16:9 (1x), 2:1 (1x), 3.26:1 (1x), 4.27:1 (1x), 6.25:1 (1x), 5.3:1 (1x), 3:2 (1x)

## Motion Language

**Feel:** springy · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `xs` | `100ms` | 100 |
| `sm` | `160ms` | 160 |
| `md` | `260ms` | 260 |
| `lg` | `420ms` | 420 |

### Easing Families

- **ease-out** (142 uses) — `cubic-bezier(0.16, 1, 0.3, 1)`, `cubic-bezier(0.22, 1, 0.36, 1)`, `cubic-bezier(0.2, 0.8, 0.2, 1)`
- **spring** (2 uses) — `cubic-bezier(0.34, 1.45, 0.55, 1)`, `cubic-bezier(0.18, 0.9, 0.22, 1.18)`
- **linear** (3 uses) — `linear`
- **custom** (28 uses) — `cubic-bezier(0.4, 0, 0.2, 1)`
- **ease-in-out** (28 uses) — `ease`

### Spring / Overshoot Easings

- `cubic-bezier(0.34, 1.45, 0.55, 1)`
- `cubic-bezier(0.18, 0.9, 0.22, 1.18)`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `tableHeaderAppear-h1tkdw5w` | slide-y | opacity, transform | 1 |
| `tableRowAppear-dswo5q4` | fade | opacity, max-height | 14 |
| `promptTextSwap-pmfr1z5` | slide-y | opacity, filter, transform | 1 |

## Component Anatomy

### button — 30 instances

**Slots:** label, icon

## Brand Voice

**Tone:** neutral · **Pronoun:** you-only · **Headings:** Title Case (balanced)

### Top CTA Verbs

- **talk** (3)
- **can** (2)
- **resources** (1)
- **s** (1)
- **companies** (1)
- **people** (1)
- **opportunities** (1)
- **tasks** (1)

### Button Copy Patterns

- "talk to us" (3×)
- "resources" (1×)
- "s
sales dashboard
· dashboard" (1×)
- "companies" (1×)
- "people" (1×)
- "opportunities" (1×)
- "tasks" (1×)
- "notes" (1×)
- "dashboards" (1×)
- "workflows" (1×)

### Sample Headings

> Build your Enterprise CRM at AI Speed
> A custom CRM gives your org an edge, but building one comes with tradeoffs
> The Giant Monolith
> The In-house Burden
> Assemble, iterate and adapt a robust CRM, that's quick to flex
> Build your Enterprise CRM at AI Speed
> A custom CRM gives your org an edge, but building one comes with tradeoffs
> The Giant Monolith
> The In-house Burden
> Assemble, iterate and adapt a robust CRM, that's quick to flex

## Page Intent

**Type:** `pricing` (confidence 0.42)
**Description:** The #1 Open Source CRM for modern teams. Modular, scalable, and built to fit your business.

Alternates: landing (0.45), blog-post (0.35)

## Section Roles

Reading order (top→bottom): cta → nav → nav → pricing-table → hero → cta → content → testimonials → testimonial → content → footer → footer → footer → testimonials → content → testimonial → cta → footer → nav → nav

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | cta | — | 0.75 |
| 1 | nav | — | 0.9 |
| 2 | nav | — | 0.9 |
| 3 | pricing-table | Build your Enterprise CRM at AI Speed | 0.9 |
| 4 | hero | Build your Enterprise CRM at AI Speed | 0.85 |
| 5 | cta | — | 0.75 |
| 6 | content | — | 0.3 |
| 7 | testimonials | A custom CRM gives your org an edge, but building one comes with tradeoffs | 0.4 |
| 8 | testimonial | Assemble, iterate and adapt a robust CRM, that's quick to flex | 0.8 |
| 9 | footer | — | 0.95 |
| 10 | footer | — | 0.95 |
| 11 | footer | — | 0.95 |
| 12 | content | Begin with production-grade building blocks | 0.3 |
| 13 | testimonials | Make your GTM team happy with a CRM they'll love | 0.4 |
| 14 | content | Dev teams power company-wide change with Twenty | 0.3 |
| 15 | testimonial | — | 0.8 |
| 16 | cta | Stop fighting custom. Start building, with Twenty | 0.75 |
| 17 | footer | — | 0.95 |
| 18 | nav | — | 0.9 |
| 19 | nav | — | 0.9 |

## Material Language

**Label:** `material-you` (confidence 0.45)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.44 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 999px |
| backdrop-filter in use | no |
| Gradients | 1 |

## Imagery Style

**Label:** `icon-only` (confidence 0.025)
**Counts:** total 81, svg 0, icon 83, screenshot-like 0, photo-like 0
**Dominant aspect:** square-ish
**Radius profile on images:** square

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Host Grotesk` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
