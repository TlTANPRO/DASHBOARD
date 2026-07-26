# Design Language: Attio: The CRM for agentic revenue

> Extracted from `https://attio.com/product` on July 26, 2026
> 744 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#030303` | hsl(0, 0%, 1%) | 9 |
| `#ffffff` | hsl(0, 0%, 100%) | 3 |
| `#c1c1c1` | hsl(0, 0%, 76%) | 1 |

### Background Colors

Used on large-area elements: `#ffffff`

### Text Colors

Text color palette: `#030303`

### Gradients

```css
background-image: linear-gradient(lab(99.9987 0.0337958 0.000309944), lab(99.9987 0.0337958 0.000309944));
```

```css
background-image: radial-gradient(at 50% -10%, lab(12.7212 0.103362 -2.22102) 0%, lab(12.7212 0.103362 -2.22102) 100%);
```

```css
background-image: linear-gradient(lab(76.2541 -1.09726 -7.09252), lab(76.2541 -1.09726 -7.09252));
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#030303` | text, border | 9 |
| `#ffffff` | background | 3 |
| `#c1c1c1` | border | 1 |

## Typography

### Font Families

- **inter** — used for all (733 elements)
- **interDisplay** — used for all (11 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 56px | 3.5rem | 600 | 60px | -0.84px | h1 |
| 20px | 1.25rem | 500 | 26px | -0.2px | p |
| 16px | 1rem | 500 | 22px | -0.16px | html, head, meta, link |
| 15px | 0.9375rem | 500 | 22px | -0.16px | button, span, svg, path |
| 14px | 0.875rem | 500 | 20px | -0.07px | span, p, a, h2 |
| 13px | 0.8125rem | 500 | 20px | -0.16px | span |
| 12px | 0.75rem | 600 | 16px | 0.72px | p, div, a |
| 10px | 0.625rem | 400 | 7px | normal | div |

### Heading Scale

```css
h1 { font-size: 56px; font-weight: 600; line-height: 60px; }
h2 { font-size: 14px; font-weight: 500; line-height: 20px; }
```

### Body Text

```css
body { font-size: 16px; font-weight: 500; line-height: 22px; }
```

### Font Weights in Use

`500` (643x), `400` (90x), `600` (11x)

## Spacing

**Base unit:** 4px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-15 | 15px | 0.9375rem |
| spacing-20 | 20px | 1.25rem |
| spacing-24 | 24px | 1.5rem |
| spacing-28 | 28px | 1.75rem |
| spacing-40 | 40px | 2.5rem |
| spacing-48 | 48px | 3rem |
| spacing-80 | 80px | 5rem |
| spacing-116 | 116px | 7.25rem |
| spacing-120 | 120px | 7.5rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| xs | 2px | 1 |
| md | 8px | 43 |
| lg | 12px | 15 |
| lg | 16px | 1 |
| xl | 19px | 1 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(28, 29, 31, 0.1) 0px 0px 0px 1px, rgba(28, 29, 31, 0.05) 0px 1px 2px 0px, rgba(28, 29, 31, 0.02) 0px 2px 4px -1px, rgba(28, 29, 31, 0.03) 0px 4px 8px -2px, rgba(28, 29, 31, 0.04) 0px 8px 16px -4px, rgba(28, 29, 31, 0.05) 0px 16px 32px -8px, rgba(28, 29, 31, 0.06) 0px 32px 64px -8px;
```

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklch(0 0 0 / 0.01) 0px 1px 3px 0px, oklch(0 0 0 / 0.02) 0px 2px 4px -1px, oklch(0 0 0 / 0.03) 0px 4px 8px -2px, oklch(0 0 0 / 0.04) 0px 8px 16px -4px, oklch(0 0 0 / 0.05) 0px 16px 32px -8px;
```

**xs** — blur: 2px
```css
box-shadow: oklch(0 0 0 / 0.01) 0px 1px 2px 0px, oklch(0 0 0 / 0.02) 0px 2px 4px -1px, oklch(0 0 0 / 0.03) 0px 4px 8px -2px;
```

**sm** — blur: 5px
```css
box-shadow: rgb(128, 128, 128) 0px 0px 5px 0px;
```

## CSS Custom Properties

### Colors

```css
--button-outline-bg: var(--color-white-100);
--button-outline-border: var(--color-white-800);
--button-outline-bg-hover: var(--color-white-100);
--button-outline-border-hover: var(--color-black-700);
--button-outline-bg-focus: var(--color-white-100);
--button-outline-border-focus: var(--color-black-700);
--button-outline-bg-active: var(--color-white-300);
--button-outline-border-active: var(--color-black-500);
--button-outline-bg-disabled: var(--color-white-100);
--button-outline-border-disabled: var(--color-white-500);
--button-outline-text-disabled-foreground: var(--color-white-800);
--button-ghost-bg: transparent;
--button-ghost-bg-hover: var(--color-white-300);
--button-ghost-bg-focus: var(--color-white-300);
--button-ghost-bg-active: var(--color-white-400);
--button-ghost-bg-disabled: transparent;
--button-ghost-text-disabled-foreground: var(--color-white-900);
--color-page-background: var(--color-primary-background);
--color-banner-background: var(--color-black-0);
--color-overscroll-top: var(--color-page-background);
--color-overscroll-bottom: var(--color-black-50);
--color-black-500: lab(25.9077% -.872329 -6.43952);
--internal-color-muted-background: lab(94.3726% -.157326 -2.23036);
--color-white-800: lab(83.208% -.844151 -5.26234);
--tw-mask-bottom-to-color: transparent;
--tw-mask-bottom-from-color: black;
--internal-color-primary-background: lab(99.9987% .0337958 .000309944);
--tw-inset-ring-shadow: 0 0 #0000;
--color-blue-300: lab(74.4638% .491381 -39.1192);
--internal-color-secondary-background: lab(98.2947% .128329 -.513124);
--color-primary-foreground: lab(10.7201% -.0959039 -1.54182);
--color-green-500: lab(69.4503% -54.6161 23.889);
--color-blue-400: lab(64.9619% 2.48078 -48.6699);
--color-white-400: lab(94.3726% -.157326 -2.23036);
--color-changelog-tag-design: lab(67.9549% -26.525 -36.1223);
--color-black-700: lab(50.3787% -1.31875 -9.56043);
--tw-mask-left-from-color: black;
--color-black-800: lab(62.775% -1.33127 -9.18812);
--color-black-50: lab(4.67701% 0 0);
--color-blue-800: lab(13.0867% .526637 -12.4652);
--color-black-400: lab(20.5697% -.638425 -4.44436);
--color-subtle-stroke: lab(91.5182% -.365466 -2.84777);
--color-black-200: lab(12.7212% .103362 -2.22102);
--color-white-200: lab(98.2947% .128329 -.513124);
--color-blue-100: lab(94.5144% -.645697 -8.23606);
--color-green-600: lab(64.8297% -51.5975 22.501);
--internal-color-focus-ring: color-mix(in oklab, lab(47.8503% 16.7831 -73.4422) 30%, transparent);
--tw-mask-right-from-color: black;
--reporting-hero-card-reports-gradient-angle: 0deg;
--color-accent-foreground: lab(50.3787% -1.31875 -9.56043);
--internal-color-secondary-foreground: lab(14.599% -.159428 -2.99254);
--color-surface: lab(94.3726% -.157326 -2.23036);
--tw-mask-top-to-color: transparent;
--color-blue-600: lab(39.8546% 12.4429 -60.277);
--tw-border-style: solid;
--color-changelog-tag-enhancement: lab(65.7076% 25.2105 -45.1559);
--color-red-600: lab(59.1651% 62.9685 37.6953);
--color-black-100: lab(10.7201% -.0959039 -1.54182);
--internal-color-default-stroke: lab(86.0989% -.77799 -4.0961);
--tw-mask-right-to-color: transparent;
--color-disabled-foreground: lab(86.0989% -.77799 -4.0961);
--button-primary-bg-from: rgb(0, 0, 0);
--internal-color-muted-strong-background: lab(86.0989% -.77799 -4.0961);
--color-black-900: lab(70.311% -1.30147 -7.86561);
--tw-ring-shadow: 0 0 #0000;
--color-yellow-600: lab(71.6198% 11.7839 74.107);
--tw-mask-linear-to-color: transparent;
--tw-mask-linear-from-color: black;
--color-secondary-background: lab(98.2947% .128329 -.513124);
--color-caption-foreground: lab(70.311% -1.30147 -7.86561);
--pricing-cards-grid-line-position-start: -33%;
--color-strong-stroke: lab(83.208% -.844151 -5.26234);
--pricing-cards-grid-line-position-end: -3%;
--internal-color-weak-stroke: lab(94.3726% -.157326 -2.23036);
--color-changelog-tag-feature: lab(66.5837% 1.83815 -49.0889);
--tw-ring-offset-color: #fff;
--color-black-300: lab(14.599% -.159428 -2.99254);
--internal-color-strong-stroke: lab(83.208% -.844151 -5.26234);
--workflows-card-gradient-angle: 0deg;
--color-red-500: lab(61.966% 63.1275 36.9452);
--color-weak-stroke: lab(94.3726% -.157326 -2.23036);
--color-black-600: lab(37.426% -1.09151 -9.33263);
--tw-ring-offset-width: 0px;
--color-white-900: lab(76.2541% -1.09726 -7.09252);
--internal-color-subtle-stroke: lab(91.5182% -.365466 -2.84777);
--internal-color-accent-foreground: lab(50.3787% -1.31875 -9.56043);
--tw-mask-top-from-color: black;
--color-secondary-foreground: lab(14.599% -.159428 -2.99254);
--tw-ring-offset-shadow: 0 0 #0000;
--color-white-600: lab(89.685% -.706792 -2.95746);
--color-default-stroke: lab(86.0989% -.77799 -4.0961);
--internal-color-surface: lab(94.3726% -.157326 -2.23036);
--color-black-0: lab(0% 0 0);
--color-blue-450: lab(57.9113% 6.67286 -58.8402);
--color-white-100: lab(99.9987% .0337958 .000309944);
--internal-color-primary-foreground: lab(10.7201% -.0959039 -1.54182);
--internal-color-link-foreground: lab(47.8503% 16.7831 -73.4422);
--color-white-700: lab(86.0989% -.77799 -4.0961);
--color-blue-500: lab(47.8503% 16.7831 -73.4422);
--internal-color-accent-stroke: lab(64.9619% 2.48078 -48.6699);
--tw-mask-left-to-color: transparent;
--internal-color-link-strong-foreground: lab(39.8546% 12.4429 -60.277);
--color-blue-200: lab(87.1089% -1.43275 -19.5035);
--internal-color-disabled-foreground: lab(86.0989% -.77799 -4.0961);
--color-primary-background: lab(99.9987% .0337958 .000309944);
--button-primary-bg-to: rgb(0, 0, 0);
--color-white-500: lab(91.5182% -.365466 -2.84777);
--internal-color-tertiary-foreground: lab(37.426% -1.09151 -9.33263);
--color-yellow-500: lab(79.0964% 13.374 80.5465);
--internal-color-surface-subtle: lab(96.1596% -.0828803 -1.13571);
--color-white-300: lab(96.1596% -.0828803 -1.13571);
--internal-color-caption-foreground: lab(70.311% -1.30147 -7.86561);
```

### Spacing

```css
--text-2xl--letter-spacing: -.01em;
--tw-space-x-reverse: 0;
--text-sm--letter-spacing: -.005em;
--text-heading-xs--letter-spacing: -.01em;
--text-heading-md--letter-spacing: -.01em;
--text-lg--letter-spacing: -.01em;
--spacing: .25rem;
--tw-space-y-reverse: 0;
--text-heading-lg--letter-spacing: -.015em;
--text-xl--letter-spacing: -.01em;
--text-base--letter-spacing: -.01em;
--text-heading-xl--letter-spacing: -.02em;
--ease-emphasized-in-out: cubic-bezier(.2, 0, 0, 1);
--text-xs--letter-spacing: 0;
--text-heading-sm--letter-spacing: -.01em;
```

### Typography

```css
--button-outline-text: var(--color-black-400);
--button-outline-text-hover: var(--color-black-400);
--button-outline-text-focus: var(--color-black-400);
--button-outline-text-active: var(--color-black-300);
--button-ghost-text: var(--color-black-400);
--button-ghost-text-hover: var(--color-black-300);
--button-ghost-text-focus: var(--color-black-300);
--button-ghost-text-active: var(--color-black-200);
--context-menu-portal-z-index: 200;
--context-menu-positioner-z-index: 201;
--context-menu-popup-z-index: 202;
--text-heading-sm--font-weight: 600;
--text-heading-lg: 3.5rem;
--text-heading-sm--line-height: 2.25rem;
--text-base--line-height: 1.375rem;
--tracking-wider: .05em;
--font-mono: "JetBrains Mono", "JetBrains Mono Fallback";
--text-heading-sm: 2rem;
--text-sm--font-weight: 500;
--text-2xl--font-weight: 500;
--font-weight-bold: 700;
--text-heading-xs: 1.75rem;
--text-xs--line-height: 1.125rem;
--text-xl: 1.25rem;
--leading-relaxed: 1.625;
--text-heading-lg--font-weight: 600;
--text-heading-xs--line-height: 2.125rem;
--text-heading-md--font-weight: 600;
--text-2xl--line-height: 1.875rem;
--text-heading-xl: 4rem;
--text-heading-md: 2.5rem;
--text-xl--line-height: 1.625rem;
--text-sm: .875rem;
--text-heading-xl--font-weight: 600;
--leading-tight: 1.25;
--text-xl--font-weight: 500;
--text-heading-lg--line-height: 3.75rem;
--text-heading-md--line-height: 2.75rem;
--font-inter-display: "interDisplay", "interDisplay Fallback";
--tw-text-shadow-alpha: 100%;
--tracking-tight: -.025em;
--text-2xl: 1.5rem;
--text-xs--font-weight: 500;
--text-lg: 1.125rem;
--text-lg--line-height: 1.5rem;
--font-jetbrains-mono: "JetBrains Mono", "JetBrains Mono Fallback";
--text-heading-xl--line-height: 4rem;
--font-weight-light: 300;
--default-font-family: "inter", "inter Fallback";
--font-inter: "inter", "inter Fallback";
--text-base--font-weight: 500;
--font-tiempos-text: "tiemposText", "tiemposText Fallback";
--tracking-tighter: -.05em;
--text-lg--font-weight: 500;
--tracking-wide: .025em;
--text-heading-xs--font-weight: 600;
--font-weight-semibold: 600;
--tracking-normal: 0em;
--text-sm--line-height: 1.25rem;
--text-xs: .75rem;
--font-weight-medium: 500;
--font-weight-normal: 400;
--text-base: 1rem;
--default-mono-font-family: "JetBrains Mono", "JetBrains Mono Fallback";
```

### Shadows

```css
--tw-inset-shadow-alpha: 100%;
--tw-inset-shadow: 0 0 #0000;
--tw-shadow-alpha: 100%;
--shadow-attio-layer-2: 0px 2px 4px -1px oklch(0% 0 0/.02);
--tw-drop-shadow-alpha: 100%;
--shadow-attio-layer-5: 0px 16px 32px -8px oklch(0% 0 0/.05);
--shadow-attio-layer-3: 0px 4px 8px -2px oklch(0% 0 0/.03);
--shadow-attio-layer-7: 0px 64px 128px -32px oklch(0% 0 0/.07);
--shadow-attio-layer-1: 0px 1px 3px 0px oklch(0% 0 0/.01);
--shadow-attio-layer-6: 0px 32px 64px -16px oklch(0% 0 0/.06);
--tw-shadow: 0 0 #0000;
--shadow-attio-layer-4: 0px 8px 16px -4px oklch(0% 0 0/.04);
```

### Radii

```css
--radius-sm: .25rem;
--radius-2xl: 1rem;
--radius-md: .375rem;
--radius-lg: .5rem;
--radius-3xl: 1.25rem;
--radius-xs: .125rem;
--radius-xl: .75rem;
```

### Other

```css
--mobile-nav-drawer-overlay-z-index: 90;
--mobile-nav-drawer-content-z-index: 91;
--site-header-z-index: 92;
--navigation-menu-z-index: 93;
--dialog-overlay-z-index: 100;
--dialog-content-z-index: 101;
--style-overlay-z-index: 999;
--site-header-height: calc(var(--site-header-polaris-toolbar-height) + var(--site-header-nav-height) + var(--site-header-subheader-height) + var(--site-header-banner-height));
--site-header-nav-height: 52px;
--site-header-banner-hidden-height: 0px;
--site-header-banner-visible-height: 48px;
--site-header-banner-height: var(--site-header-banner-hidden-height);
--site-header-polaris-toolbar-hidden-height: 0px;
--site-header-polaris-toolbar-visible-height: 36px;
--site-header-polaris-toolbar-height: var(--site-header-polaris-toolbar-hidden-height);
--site-header-subheader-desktop-height: 0px;
--site-header-subheader-mobile-hidden-height: 0px;
--site-header-subheader-mobile-visible-height: 63px;
--site-header-subheader-mobile-height: var(--site-header-subheader-mobile-hidden-height);
--site-header-subheader-height: var(--site-header-subheader-desktop-height);
--container-md: 28rem;
--tw-mask-left-to-position: 100%;
--aspect-video: 16 / 9;
--blur-lg: 16px;
--animate-navigation-exit-to-left: navigation-exit-to-left .2s cubic-bezier(.65, 0, .35, 1);
--tw-mask-conic: linear-gradient(#fff, #fff);
--tw-outline-style: solid;
--ease-in: cubic-bezier(.3, 0, 1, 1);
--ai-hero-box-gradient-angle: 0deg;
--tw-mask-top-to-position: 100%;
--tw-gradient-from: rgba(0, 0, 0, 0);
--tw-gradient-to: rgba(0, 0, 0, 0);
--tw-mask-linear-from-position: 0%;
--tw-gradient-via-position: 50%;
--animate-slideUp: slideUp .3s cubic-bezier(.65, 0, .35, 1);
--tw-mask-right: linear-gradient(#fff, #fff);
--tw-gradient-to-position: 100%;
--default-transition-duration: .15s;
--animate-pulse: pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;
--ease-in-out-cubic: cubic-bezier(.65, 0, .35, 1);
--container-xs: 20rem;
--animate-productivity-intro-height: productivity-intro-height .8s linear;
--default-transition-timing-function: cubic-bezier(.4, 0, .2, 1);
--aspect-golden: 1.618;
--ease-in-out-expo: cubic-bezier(1, 0, 0, 1);
--tw-translate-z: 0;
--tw-gradient-via: rgba(0, 0, 0, 0);
--tw-scale-y: 1;
--tw-mask-radial: linear-gradient(#fff, #fff);
--container-6xl: 72rem;
--breakpoint-lg: 992px;
--blur-xs: 4px;
--tw-translate-y: 0;
--ease-out: cubic-bezier(0, 0, 0, 1);
--tw-content: "";
--animate-navigation-enter-from-left: navigation-enter-from-left .2s cubic-bezier(.65, 0, .35, 1);
--tw-mask-top: linear-gradient(#fff, #fff);
--tw-mask-linear-position: 0deg;
--animate-productivity-intro-width: productivity-intro-width .8s linear;
--tw-translate-x: 0;
--tw-mask-right-from-position: 0%;
--container-xl: 36rem;
--tw-mask-linear: linear-gradient(#fff, #fff);
--animate-caret-blink: caret-blink .5s cubic-bezier(.42, 0, .58, 1) infinite;
--ease-reveal: cubic-bezier(0, 0, .58, 1);
--animate-slideDown: slideDown .3s cubic-bezier(.65, 0, .35, 1);
--tw-mask-left-from-position: 0%;
--blur-xl: 24px;
--tw-divide-x-reverse: 0;
--tw-mask-bottom-to-position: 100%;
--tw-scale-z: 1;
--animate-navigation-exit-to-right: navigation-exit-to-right .2s cubic-bezier(.65, 0, .35, 1);
--container-sm: 24rem;
--tw-scroll-snap-strictness: proximity;
--container-lg: 32rem;
--tw-gradient-from-position: 0%;
--ease-in-out: cubic-bezier(.2, 0, 0, 1);
--tw-mask-linear-to-position: 100%;
--tw-mask-right-to-position: 100%;
--container-5xl: 64rem;
--ease-out-cubic: cubic-bezier(.33, 1, .68, 1);
--ease-in-out-quad: cubic-bezier(.45, .05, .55, .95);
--animate-collapsibleSlideUp: collapsibleSlideUp .3s cubic-bezier(.65, 0, .35, 1);
--blur-md: 12px;
--animate-spin: spin 1s linear infinite;
--container-4xl: 56rem;
--tw-mask-left: linear-gradient(#fff, #fff);
--tw-mask-bottom-from-position: 0%;
--tw-divide-y-reverse: 0;
--animate-search-shine: search-shine 1s ease-in-out infinite;
--container-2xl: 42rem;
--ease-in-cubic: cubic-bezier(.32, 0, .67, 0);
--tw-mask-top-from-position: 0%;
--animate-dialog-scale-in: dialog-scale-in .2s cubic-bezier(.45, .05, .55, .95);
--tw-scale-x: 1;
--animate-dialog-scale-out: dialog-scale-out .2s cubic-bezier(.45, .05, .55, .95);
--tw-mask-bottom: linear-gradient(#fff, #fff);
--container-7xl: 80rem;
--animate-navigation-enter-from-right: navigation-enter-from-right .2s cubic-bezier(.65, 0, .35, 1);
--animate-collapsibleSlideDown: collapsibleSlideDown .3s cubic-bezier(.65, 0, .35, 1);
```

### Dependencies

```css
--button-outline-bg: --color-white-100;
--button-outline-border: --color-white-800;
--button-outline-text: --color-black-400;
--button-outline-bg-hover: --color-white-100;
--button-outline-border-hover: --color-black-700;
--button-outline-text-hover: --color-black-400;
--button-outline-bg-focus: --color-white-100;
--button-outline-border-focus: --color-black-700;
--button-outline-text-focus: --color-black-400;
--button-outline-bg-active: --color-white-300;
--button-outline-border-active: --color-black-500;
--button-outline-text-active: --color-black-300;
--button-outline-bg-disabled: --color-white-100;
--button-outline-border-disabled: --color-white-500;
--button-outline-text-disabled-foreground: --color-white-800;
--button-ghost-text: --color-black-400;
--button-ghost-bg-hover: --color-white-300;
--button-ghost-text-hover: --color-black-300;
--button-ghost-bg-focus: --color-white-300;
--button-ghost-text-focus: --color-black-300;
--button-ghost-bg-active: --color-white-400;
--button-ghost-text-active: --color-black-200;
--button-ghost-text-disabled-foreground: --color-white-900;
--site-header-height: --site-header-polaris-toolbar-height,--site-header-nav-height,--site-header-subheader-height,--site-header-banner-height;
--site-header-banner-height: --site-header-banner-hidden-height;
--site-header-polaris-toolbar-height: --site-header-polaris-toolbar-hidden-height;
--site-header-subheader-mobile-height: --site-header-subheader-mobile-hidden-height;
--site-header-subheader-height: --site-header-subheader-desktop-height;
--color-page-background: --color-primary-background;
--color-banner-background: --color-black-0;
--color-overscroll-top: --color-page-background;
--color-overscroll-bottom: --color-black-50;
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
| sm | 600px | max-width |
| lg | 992px | min-width |
| 1199px | 1199px | max-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`, `[object Object]`, `[object Object]`

**Durations:** `0.25s`, `0.4s`, `0.3s`, `0.15s`, `0.7s`, `0.2s`

### Common Transitions

```css
transition: all;
transition: color 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), outline-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), text-decoration-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), fill 0.25s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.25s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-from 0.25s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-via 0.25s cubic-bezier(0.4, 0, 0.2, 1), --tw-gradient-to 0.25s cubic-bezier(0.4, 0, 0.2, 1);
transition: background-size 0.4s cubic-bezier(0.65, 0, 0.35, 1);
transition: translate 0.4s cubic-bezier(0.2, 0, 0, 1);
transition: color 0.3s cubic-bezier(0.2, 0, 0, 1), background-color 0.3s cubic-bezier(0.2, 0, 0, 1), border-color 0.3s cubic-bezier(0.2, 0, 0, 1), outline-color 0.3s cubic-bezier(0.2, 0, 0, 1), text-decoration-color 0.3s cubic-bezier(0.2, 0, 0, 1), fill 0.3s cubic-bezier(0.2, 0, 0, 1), stroke 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-from 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-via 0.3s cubic-bezier(0.2, 0, 0, 1), --tw-gradient-to 0.3s cubic-bezier(0.2, 0, 0, 1);
transition: transform 0.3s cubic-bezier(0.65, 0, 0.35, 1), translate 0.3s cubic-bezier(0.65, 0, 0.35, 1);
transition: translate 0.15s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.15s cubic-bezier(0.65, 0, 0.35, 1), width 0.15s cubic-bezier(0.65, 0, 0.35, 1), height 0.15s cubic-bezier(0.65, 0, 0.35, 1);
transition: opacity 0.15s cubic-bezier(0.65, 0, 0.35, 1);
transition: color 0.15s cubic-bezier(0, 0, 0, 1), background-color 0.15s cubic-bezier(0, 0, 0, 1), border-color 0.15s cubic-bezier(0, 0, 0, 1), outline-color 0.15s cubic-bezier(0, 0, 0, 1), text-decoration-color 0.15s cubic-bezier(0, 0, 0, 1), fill 0.15s cubic-bezier(0, 0, 0, 1), stroke 0.15s cubic-bezier(0, 0, 0, 1), --tw-gradient-from 0.15s cubic-bezier(0, 0, 0, 1), --tw-gradient-via 0.15s cubic-bezier(0, 0, 0, 1), --tw-gradient-to 0.15s cubic-bezier(0, 0, 0, 1);
transition: opacity 0.4s cubic-bezier(0.2, 0, 0, 1), translate 0.4s cubic-bezier(0.2, 0, 0, 1);
```

### Keyframe Animations

**ai-hero-box-gradient-spin**
```css
@keyframes ai-hero-box-gradient-spin {
  0% { --ai-hero-box-gradient-angle: 0deg; }
  100% { --ai-hero-box-gradient-angle: 360deg; }
}
```

**rotate-reporting**
```css
@keyframes rotate-reporting {
  0% { --reporting-hero-card-reports-gradient-angle: 0deg; }
  100% { --reporting-hero-card-reports-gradient-angle: 360deg; }
}
```

**pricing-cards-grid-line-appear**
```css
@keyframes pricing-cards-grid-line-appear {
  100% { --pricing-cards-grid-line-position-start: 100%; --pricing-cards-grid-line-position-end: 130%; }
}
```

**rotate**
```css
@keyframes rotate {
  0% { --workflows-card-gradient-angle: 0deg; }
  18% { --workflows-card-gradient-angle: 76deg; }
  27% { --workflows-card-gradient-angle: 104deg; }
  63% { --workflows-card-gradient-angle: 256deg; }
  72% { --workflows-card-gradient-angle: 284deg; }
  100% { --workflows-card-gradient-angle: 360deg; }
}
```

**connection**
```css
@keyframes connection {
  100% { opacity: 1; }
}
```

**running**
```css
@keyframes running {
  0% { opacity: 0; top: 0px; }
  15%, 85% { opacity: 1; top: -28px; }
  100% { opacity: 0; top: 0px; }
}
```

**completed**
```css
@keyframes completed {
  0%, 85% { opacity: 0; top: 0px; }
  100% { opacity: 1; top: -28px; }
}
```

**spin**
```css
@keyframes spin {
  100% { transform: rotate(360deg); }
}
```

**pulse**
```css
@keyframes pulse {
  50% { opacity: 0.5; }
}
```

**enter**
```css
@keyframes enter {
  0% { opacity: var(--tw-enter-opacity,1); transform: translate3d(var(--tw-enter-translate-x,0), var(--tw-enter-translate-y,0), var(--tw-enter-translate-z,0)) scale3d(var(--tw-enter-scale,1), var(--tw-enter-scale,1), var(--tw-enter-scale,1)) rotateX(var(--tw-enter-rotate-x,0)) rotateY(var(--tw-enter-rotate-y,0)) rotate(var(--tw-enter-rotate,0)); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (32 instances)

```css
.button {
  background-color: lab(99.9987 0.0337958 0.000309944);
  color: lab(20.5697 -0.638425 -4.44436);
  font-size: 16px;
  font-weight: 500;
  padding-top: 0px;
  padding-right: 8px;
  border-radius: 10px;
}
```

### Cards (1 instances)

```css
.card {
  background-color: lab(99.9987 0.0337958 0.000309944);
  border-radius: 19px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklch(0 0 0 / 0.01) 0px 1px 3px 0px, oklch(0 0 0 / 0.02) 0px 2px 4px -1px, oklch(0 0 0 / 0.03) 0px 4px 8px -2px, oklch(0 0 0 / 0.04) 0px 8px 16px -4px, oklch(0 0 0 / 0.05) 0px 16px 32px -8px;
  padding-top: 20px;
  padding-right: 20px;
}
```

### Inputs (1 instances)

```css
.input {
  background-color: rgb(255, 255, 255);
  color: lab(10.7201 -0.0959039 -1.54182);
  border-color: rgb(193, 193, 193);
  border-radius: 0px;
  font-size: 16px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Links (73 instances)

```css
.link {
  color: lab(76.2541 -1.09726 -7.09252);
  font-size: 14px;
  font-weight: 400;
}
```

### Navigation (9 instances)

```css
.navigatio {
  background-color: lab(99.9987 0.0337958 0.000309944);
  color: lab(10.7201 -0.0959039 -1.54182);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
  box-shadow: oklch(0 0 0 / 0.01) 0px 1px 2px 0px, oklch(0 0 0 / 0.02) 0px 2px 4px -1px, oklch(0 0 0 / 0.03) 0px 4px 8px -2px;
}
```

### Footer (1 instances)

```css
.foote {
  background-color: lab(4.67701 0 0);
  color: lab(10.7201 -0.0959039 -1.54182);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 16px;
}
```

### Modals (4 instances)

```css
.modal {
  background-color: oklab(0.999997 0.0000899732 0.000023365 / 0.95);
  border-radius: 0px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(28, 29, 31, 0.1) 0px 0px 0px 1px, rgba(28, 29, 31, 0.05) 0px 1px 2px 0px, rgba(28, 29, 31, 0.02) 0px 2px 4px -1px, rgba(28, 29, 31, 0.03) 0px 4px 8px -2px, rgba(28, 29, 31, 0.04) 0px 8px 16px -4px, rgba(28, 29, 31, 0.05) 0px 16px 32px -8px, rgba(28, 29, 31, 0.06) 0px 32px 64px -8px;
  padding-top: 0px;
  padding-right: 0px;
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: lab(94.3726 -0.157326 -2.23036);
  padding: 0px 0px 0px 0px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0);
  font-size: 16px;
  font-weight: 500;
```

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: lab(20.5697 -0.638425 -4.44436);
  padding: 0px 8px 0px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0);
  font-size: 15px;
  font-weight: 500;
```

### Button — 4 instances, 1 variant

**Variant 1** (4 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: lab(20.5697 -0.638425 -4.44436);
  padding: 0px 12px 0px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0);
  font-size: 15px;
  font-weight: 500;
```

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: lab(12.7212 0.103362 -2.22102);
  color: lab(96.1596 -0.0828803 -1.13571);
  padding: 0px 12px 0px 12px;
  border-radius: 10px;
  border: 1px solid lab(37.426 -1.09151 -9.33263);
  font-size: 14px;
  font-weight: 500;
```

## Layout System

**4 grid containers** and **127 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1440px | 24px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 12-column | 2x |
| 3-column | 1x |

### Grid Templates

```css
grid-template-columns: 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px;
grid-template-columns: 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px 102.5px;
gap: 48px normal;
grid-template-columns: none;
grid-template-columns: repeat(2, minmax(0px, 1fr));
gap: 4px 12px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| column/nowrap | 27x |
| row/nowrap | 97x |
| row/wrap | 3x |

**Gap values:** `16px`, `24px`, `48px normal`, `4px`, `4px 12px`, `5px`, `6px`, `8px`, `normal 10px`, `normal 12px`, `normal 24px`, `normal 36px`, `normal 6px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 0 passing, 0 failing color pairs

## Design System Score

**Overall: 94/100 (Grade: A)**

| Category | Score |
|----------|-------|
| Color Discipline | 85/100 |
| Typography Consistency | 100/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 90/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Consistent typography system, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- No clear primary brand color detected
- 181 !important rules — prefer specificity over overrides
- 4931 duplicate CSS declarations

## Gradients

**3 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | — | 2 | brand |
| radial | at 50% -10% | 2 | brand |
| linear | — | 2 | brand |

```css
background: linear-gradient(lab(99.9987 0.0337958 0.000309944), lab(99.9987 0.0337958 0.000309944));
background: radial-gradient(at 50% -10%, lab(12.7212 0.103362 -2.22102) 0%, lab(12.7212 0.103362 -2.22102) 100%);
background: linear-gradient(lab(76.2541 -1.09726 -7.09252), lab(76.2541 -1.09726 -7.09252));
```

## Z-Index Map

**4 unique z-index values** across 3 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| dropdown | 101,101 | div.p.o.i.n.t.e.r.-.e.v.e.n.t.s.-.n.o.n.e. .f.i.x.e.d. .r.i.g.h.t.-.4. .b.o.t.t.o.m.-.4. .l.e.f.t.-.4. .z.-.(.-.-.d.i.a.l.o.g.-.c.o.n.t.e.n.t.-.z.-.i.n.d.e.x.). .f.l.e.x. .j.u.s.t.i.f.y.-.s.t.a.r.t |
| sticky | 92,92 | div.s.t.i.c.k.y. .t.o.p.-.0. .z.-.(.-.-.s.i.t.e.-.h.e.a.d.e.r.-.z.-.i.n.d.e.x.) |
| base | -1,1 | div.a.b.s.o.l.u.t.e. .i.n.s.e.t.-.0. .-.z.-.1. .b.a.c.k.d.r.o.p.-.b.l.u.r.-.m.d, nav.r.e.l.a.t.i.v.e. .z.-.1 |

## SVG Icons

**8 unique SVG icons** detected. Dominant style: **duo-tone**.

| Size Class | Count |
|------------|-------|
| xs | 1 |
| sm | 6 |
| xl | 1 |

**Icon colors:** `currentColor`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| JetBrains Mono | self-hosted | 100 800 | normal |
| inter | self-hosted | 400, 500, 600, 700 | normal |
| interDisplay | self-hosted | 500, 600, 700 | normal |
| tiemposText | self-hosted | 400 | normal, italic |

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `xs` | `150ms` | 150 |
| `sm` | `200ms` | 200 |
| `md` | `300ms` | 300 |
| `lg` | `700ms` | 700 |

### Easing Families

- **custom** (103 uses) — `cubic-bezier(0.4, 0, 0.2, 1)`, `cubic-bezier(0.65, 0, 0.35, 1)`, `cubic-bezier(0.2, 0, 0, 1)`
- **ease-out** (50 uses) — `cubic-bezier(0, 0, 0, 1)`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `enter` | slide | opacity, transform | 1 |

## Component Anatomy

### button — 9 instances

**Slots:** label, icon
**Variants:** outline · ghost · primary
**Sizes:** lg · sm

| variant | count | sample label |
|---|---|---|
| ghost | 4 | Platform |
| outline | 3 | Sign in |
| primary | 2 | Start for free |

## Brand Voice

**Tone:** neutral · **Pronoun:** third-person · **Headings:** Sentence case (tight)

### Top CTA Verbs

- **platform** (1)
- **resources** (1)
- **customers** (1)
- **pricing** (1)
- **sign** (1)
- **start** (1)
- **continue** (1)
- **reject** (1)

### Button Copy Patterns

- "platform" (1×)
- "resources" (1×)
- "customers" (1×)
- "pricing" (1×)
- "sign in" (1×)
- "start for free" (1×)
- "continue" (1×)
- "reject" (1×)

### Sample Headings

> Page not found.
> Platform
> Company
> Import from
> Attio for
> Apps

## Page Intent

**Type:** `product` (confidence 0.59)
**Description:** The system for revenue teams to build pipeline, accelerate deals, and grow accounts around the clock.	

Alternates: legal (0.4)

## Section Roles

Reading order (top→bottom): logo-wall → nav → nav → nav → content → footer → content

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | logo-wall | — | 0.85 |
| 1 | nav | — | 0.9 |
| 2 | nav | — | 0.9 |
| 3 | nav | — | 0.9 |
| 4 | content | Page not found. | 0.3 |
| 5 | footer | Platform | 0.95 |
| 6 | content | — | 0.3 |

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 19px |
| backdrop-filter in use | no |
| Gradients | 3 |

## Component Library

**Detected:** `tailwindcss` (confidence 0.596)

Evidence:
- tailwind-like class density 60%

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `inter` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
