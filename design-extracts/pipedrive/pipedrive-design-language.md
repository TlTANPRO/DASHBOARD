# Design Language: Pipedrive

> Extracted from `https://www.pipedrive.com/en/why-pipedrive` on July 26, 2026
> 526 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#6861f2` | rgb(104, 97, 242) | hsl(243, 85%, 66%) | 10 |
| Secondary | `#e3fae1` | rgb(227, 250, 225) | hsl(115, 71%, 93%) | 1 |
| Accent | `#3860be` | rgb(56, 96, 190) | hsl(222, 54%, 48%) | 8 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#000000` | hsl(0, 0%, 0%) | 414 |
| `#555555` | hsl(0, 0%, 33%) | 31 |
| `#ffffff` | hsl(0, 0%, 100%) | 29 |
| `#656565` | hsl(0, 0%, 40%) | 7 |
| `#f4f5f6` | hsl(210, 10%, 96%) | 2 |
| `#d8d8d8` | hsl(0, 0%, 85%) | 2 |
| `#bbbbbb` | hsl(0, 0%, 73%) | 1 |

### Background Colors

Used on large-area elements: `#ffffff`, `#f7f7fe`

### Text Colors

Text color palette: `#000000`, `#192435`, `#0d6ece`, `#017737`, `#0000ee`, `#0e5235`, `#ffffff`, `#0d68c5`, `#555555`, `#3860be`

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#000000` | text, border, background | 414 |
| `#192435` | text, border | 394 |
| `#0000ee` | text, border | 84 |
| `#0d6ece` | text, border | 54 |
| `#017737` | text, border | 36 |
| `#555555` | text, border | 31 |
| `#ffffff` | background, text, border | 29 |
| `#6861f2` | background, border | 10 |
| `#27455c` | background | 8 |
| `#3860be` | text, border, background | 8 |
| `#656565` | text, border | 7 |
| `#0e5235` | text, border | 4 |
| `#f4f5f6` | background | 2 |
| `#d8d8d8` | border | 2 |
| `#e3fae1` | background | 1 |
| `#32ae88` | border | 1 |
| `#468254` | background | 1 |
| `#bbbbbb` | border | 1 |

## Typography

### Font Families

- **Inter** — used for all (525 elements)
- **Haffer** — used for headings (1 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 52px | 3.25rem | 700 | 62px | normal | h1 |
| 36px | 2.25rem | 700 | 43px | normal | h2 |
| 24px | 1.5rem | 400 | normal | normal | div, span |
| 18px | 1.125rem | 700 | 30px | normal | p, button, span, a |
| 16px | 1rem | 400 | normal | normal | html, head, meta, script |
| 14.4px | 0.9rem | 400 | 38px | 0.144px | button, svg, title, g |
| 14px | 0.875rem | 400 | 25px | normal | input, a, span, footer |
| 13.6px | 0.85rem | 400 | 27.2px | normal | div, svg, path, span |
| 13.3333px | 0.8333rem | 400 | normal | normal | input |
| 13.008px | 0.813rem | 700 | 16.9104px | normal | div |
| 12.992px | 0.812rem | 400 | 19.488px | normal | div, br, a, p |
| 12.8px | 0.8rem | 400 | normal | normal | input |
| 12px | 0.75rem | 400 | 22px | normal | span, button, a, img |

### Heading Scale

```css
h1 { font-size: 52px; font-weight: 700; line-height: 62px; }
h2 { font-size: 36px; font-weight: 700; line-height: 43px; }
h2 { font-size: 16px; font-weight: 400; line-height: normal; }
h4 { font-size: 14px; font-weight: 400; line-height: 25px; }
```

### Body Text

```css
body { font-size: 14px; font-weight: 400; line-height: 25px; }
```

### Font Weights in Use

`400` (407x), `600` (80x), `700` (35x), `500` (4x)

## Spacing

**Base unit:** 2px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-15 | 15px | 0.9375rem |
| spacing-20 | 20px | 1.25rem |
| spacing-23 | 23px | 1.4375rem |
| spacing-30 | 30px | 1.875rem |
| spacing-32 | 32px | 2rem |
| spacing-35 | 35px | 2.1875rem |
| spacing-40 | 40px | 2.5rem |
| spacing-44 | 44px | 2.75rem |
| spacing-80 | 80px | 5rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| xs | 1px | 8 |
| sm | 4px | 8 |
| xl | 17px | 1 |
| xl | 20px | 1 |
| full | 50px | 1 |
| full | 100px | 1 |

## Box Shadows

**sm** — blur: 5px
```css
box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 5px 0px, rgba(0, 0, 0, 0.12) 0px 0px 4px 0px;
```

**md** — blur: 5px
```css
box-shadow: rgb(199, 197, 199) -3px -3px 5px -2px;
```

**md** — blur: 10px
```css
box-shadow: rgb(153, 153, 153) 0px 2px 10px -3px;
```

**md** — blur: 12px
```css
box-shadow: rgb(199, 197, 199) 0px 0px 12px 2px;
```

**lg** — blur: 18px
```css
box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 18px 0px;
```

## CSS Custom Properties

### Colors

```css
--pd-global-color-light-neutral-500: #93949a;
--pd-color-fill-white-static: #fff;
--pd-non-semantic-color-sky-blue-88: #3997ce;
--pd-global-color-light-neutral-400: #a9abaf;
--pd-non-semantic-color-lavender-purple-88: #754cc0;
--pd-global-color-dark-purple-100: #1a1a4e;
--pd-color-text-warning: #ffab00;
--pd-color-negative-extra-strong: #b21019;
--pd-global-color-light-neutral-0: #fff;
--pd-non-semantic-color-lavender-purple-80: #815dc5;
--pd-global-color-dark-red-800: #ec7c75;
--pd-color-fill-medium-strong: #a9abaf;
--pd-non-semantic-color-honey-yellow-108: #eaad06;
--pd-non-semantic-color-neutral-gray-20: #dddede;
--pd-color-surface-foreground: #fff;
--pd-global-color-brand-green-300: #aee9b4;
--pd-non-semantic-color-neutral-gray-72: #868889;
--pd-non-semantic-color-lemon-yellow-148: #766700;
--pd-non-semantic-color-lemon-yellow-12: #fff9cf;
--pd-color-navigation-icon: #fff;
--pd-color-icon-muted: #93949a;
--pd-non-semantic-color-sky-blue-108: #1e7cb3;
--pd-non-semantic-color-teal-green-148: #084e4d;
--pd-non-semantic-color-teal-green-56: #71c7c6;
--pd-color-text-primary-inverted: #fff;
--pd-color-text-secondary: #656e7a;
--pd-non-semantic-color-watermelon-red-64: #ff8183;
--pd-color-active-muted: #72adff;
--pd-non-semantic-color-bubblegum-pink-108: #b02c67;
--pd-color-surface-app-background: #f6f7f8;
--pd-global-color-dark-green-400: #0b5b2e;
--pd-color-info-strong: #005ab0;
--pd-global-color-light-green-900: #004d25;
--pd-global-color-dark-purple-700: #857ee9;
--pd-puco-global-color-blue-25: #d3ecff;
--pd-color-brand-landing-secondary: #f8f8fe;
--pd-non-semantic-color-lilac-purple-148: #521150;
--pd-color-navigation-background: #211c52;
--pd-non-semantic-color-electric-blue-80: #6083f3;
--pd-non-semantic-color-tangerine-orange-40: #ffd1a2;
--pd-global-color-light-red-400: #fb8b80;
--pd-non-semantic-color-emerald-green-140: #00643e;
--pd-non-semantic-color-lavender-purple-132: #43237c;
--pd-puco-color-primary-mid: #c4c2ff;
--pd-puco-color-fill-extra-light: #f4f5f6;
--pd-global-color-dark-blue-600: #4073c8;
--pd-non-semantic-color-watermelon-red-140: #a31e21;
--pd-non-semantic-color-lilac-purple-88: #a0419d;
--pd-non-semantic-color-avocado-green-20: #f0f5c0;
--pd-color-positive-background-light: #e9fbe7;
--pd-color-text-white-secondary-static: #a9abaf;
--pd-non-semantic-color-avocado-green-100: #b0c015;
--pd-color-icon-active: #0e5235;
--pd-global-color-dark-purple-900: #c0b5f0;
--pd-non-semantic-color-sky-blue-40: #97d4f7;
--pd-non-semantic-color-earth-brown-100: #9a592b;
--pd-global-color-dark-purple-800: #9c92ed;
--pd-non-semantic-color-sky-blue-92: #3391c8;
--pd-non-semantic-color-honey-yellow-140: #987104;
--pd-non-semantic-color-tangerine-orange-24: #ffe4c7;
--pd-color-icon-white-static: #fff;
--pd-non-semantic-color-neutral-gray-108: #505354;
--pd-color-text-active: #0e5235;
--pd-non-semantic-color-lemon-yellow-8: #fffce2;
--pd-color-negative-default: #ff5550;
--pd-color-text-secondary-inverted: hsla(0,0%,100%,.72);
--pd-color-secondary-default: #6962f2;
--pd-color-fill-medium: #dadde1;
--pd-color-primary-strong: #413d99;
--pd-non-semantic-color-avocado-green-32: #e6edaa;
--pd-non-semantic-color-bubblegum-pink-12: #f9e6ee;
--pd-non-semantic-color-tangerine-orange-8: #fff6ed;
--pd-non-semantic-color-earth-brown-132: #693d1d;
--pd-color-fill-strong: #93949a;
--pd-non-semantic-color-bubblegum-pink-116: #a92560;
--pd-non-semantic-color-electric-blue-8: #eff3ff;
--pd-puco-color-icon-warm: #fc0;
--pd-non-semantic-color-watermelon-red-16: #ffe0e0;
--pd-color-fill-extra-strong: #73767c;
--pd-color-text-link-inverted: #d3ecff;
--pd-non-semantic-color-avocado-green-8: #fafce0;
--pd-color-primary-hover: #26b259;
--pd-non-semantic-color-lavender-purple-20: #e0d6f1;
--pd-color-active-extra-strong: #0157ae;
--pd-color-positive-background-strong: #bedfbd;
--pd-color-text-black-static: #21232c;
--pd-global-color-light-neutral-700: #65686f;
--pd-color-navigation-active: #6150e1;
--pd-global-color-dark-blue-500: #3768ba;
--pd-puco-color-visuals-medium-warm: #ffdf5c;
--pd-global-color-light-red-800: #b21019;
--pd-puco-color-active-extra-strong: #11402e;
--pd-non-semantic-color-honey-yellow-80: #fec939;
--pd-puco-color-surface-purple-gradient-background: linear-gradient(88deg,#6861f2 -12.84%,#9c99f5 147.53%);
--pd-global-color-dark-purple-600: #6a64de;
--pd-puco-color-divider-strong: #192435;
--pd-non-semantic-color-bubblegum-pink-56: #f97bb3;
--pd-non-semantic-color-earth-brown-140: #5c351a;
--pd-non-semantic-color-emerald-green-108: #0a9460;
--pd-color-fill-medium-rgba: rgba(33,35,44,.16);
--pd-puco-global-color-red-500: #c7201b;
--pd-color-learn-background-light: #f6f4fe;
--pd-non-semantic-color-bubblegum-pink-32: #f6b7d3;
--pd-non-semantic-color-earth-brown-32: #dfcabb;
--pd-puco-color-visuals-cold: #4a8ae6;
--pd-global-color-light-yellow-200: #ffedac;
--pd-color-text-primary: #192435;
--pd-color-divider-medium: rgba(33,35,44,.12);
--pd-non-semantic-color-watermelon-red-124: #cd272a;
--pd-puco-color-surface-primary-gradient-background: linear-gradient(90deg,#d7f9d3 37.68%,#cfd0f9 92.38%,#6861f2 155.47%);
--pd-global-color-light-yellow-400: #e69b00;
--pd-non-semantic-color-tangerine-orange-4: #fffaf5;
--pd-global-color-dark-yellow-500: #915e24;
--pd-global-color-dark-yellow-600: #9f6829;
--pd-non-semantic-color-honey-yellow-4: #fffcf5;
--pd-non-semantic-color-teal-green-4: #f5fafd;
--pd-non-semantic-color-neutral-gray-40: #bcbdbd;
--pd-global-color-light-yellow-300: #ffd24a;
--pd-non-semantic-color-sky-blue-56: #6dc3f5;
--pd-color-text-secondary-rgba: rgba(33,35,44,.72);
--pd-non-semantic-color-electric-blue-100: #4164d4;
--pd-global-color-brand-green-500: #012710;
--pd-puco-global-color-yellow-800: #df971c;
--pd-color-active-strong: #0e5235;
--pd-global-color-dark-neutral-200: #2a2c35;
--pd-non-semantic-color-earth-brown-12: #f3ebe5;
--pd-global-color-dark-purple-200: #242464;
--pd-non-semantic-color-electric-blue-92: #4d70e0;
--pd-puco-color-icon-button: #413d99;
--pd-non-semantic-color-avocado-green-24: #edf3b4;
--pd-global-color-light-purple-300: #d9d1f8;
--pd-color-primary-background-light: #ecf8f0;
--pd-non-semantic-color-avocado-green-40: #dfe798;
--pd-non-semantic-color-lavender-purple-56: #a78dd7;
--pd-non-semantic-color-lemon-yellow-132: #9a8700;
--pd-non-semantic-color-watermelon-red-108: #e03a3d;
--pd-global-color-dark-neutral-700: #898b90;
--pd-puco-color-surface-dark-green-gradient-background: linear-gradient(141.6deg,#017737 27.79%,#014722 86.53%);
--pd-puco-global-color-red-25: #ffe7e6;
--pd-color-text-negative: #c7201b;
--pd-color-icon-primary-inverted: #fff;
--pd-non-semantic-color-lavender-purple-124: #4a288b;
--pd-color-negative-background-light: #fef2f0;
--pd-puco-global-color-green-500: #017737;
--pd-non-semantic-color-electric-blue-12: #e6ecff;
--pd-non-semantic-color-sky-blue-24: #c2e5f9;
--pd-puco-color-divider-secondary: #e1e1ff;
--pd-color-info-default: #0070d6;
--pd-non-semantic-color-emerald-green-80: #2fb985;
--pd-color-learn-strong: #6150e1;
--pd-non-semantic-color-sky-blue-4: #f3fbff;
--pd-color-fill-medium-strong-rgba: rgba(33,35,44,.24);
--pd-non-semantic-color-tangerine-orange-32: #ffdbb5;
--pd-non-semantic-color-lavender-purple-8: #f2eff9;
--pd-color-primary-default: #6861f2;
--pd-global-color-light-neutral-300: #d7d7d9;
--pd-non-semantic-color-sky-blue-124: #0c6aa1;
--pd-non-semantic-color-sky-blue-72: #4fade4;
--pd-color-info-background: #e1eeff;
--pd-non-semantic-color-teal-green-12: #dff4f4;
--pd-non-semantic-color-lemon-yellow-56: #fce439;
--pd-color-fill-on-inverted-medium: hsla(0,0%,100%,.16);
--pd-non-semantic-color-electric-blue-4: #f7f9ff;
--pd-non-semantic-color-avocado-green-124: #879500;
--pd-non-semantic-color-watermelon-red-92: #f44e51;
--pd-non-semantic-color-lavender-purple-140: #3b1f6e;
--pd-puco-global-color-neutral-00: #fff;
--pd-global-color-dark-yellow-400: #6e4618;
--pd-global-color-brand-green-100: #ebfce9;
--pd-puco-color-visuals-light-warm: #fff4c7;
--pd-puco-color-icon-primary-background: #d7f1e1;
--pd-non-semantic-color-honey-yellow-40: #ffe49c;
--pd-non-semantic-color-electric-blue-64: #7c9bff;
--pd-color-warning-muted: #e69b00;
--pd-non-semantic-color-emerald-green-64: #57c89d;
--pd-non-semantic-color-earth-brown-40: #d7bdaa;
--pd-non-semantic-color-lilac-purple-124: #721c6f;
--pd-non-semantic-color-honey-yellow-64: #fed460;
--pd-global-color-light-red-100: #fef2f0;
--pd-non-semantic-color-lemon-yellow-24: #fbf3b8;
--pd-puco-global-color-yellow-850: #ffab00;
--pd-color-icon-white-secondary-static: #a9abaf;
--pd-non-semantic-color-tangerine-orange-124: #cd6800;
--pd-global-color-light-green-700: #077838;
--pd-non-semantic-color-watermelon-red-32: #ffc0c1;
--pd-non-semantic-color-lemon-yellow-64: #fae021;
--pd-non-semantic-color-electric-blue-48: #9db5ff;
--pd-puco-global-color-white: #fff;
--pd-non-semantic-color-emerald-green-12: #ddf5ed;
--pd-puco-color-fill-black-static: #2a3647;
--pd-color-icon-link-muted: #72adff;
--pd-color-fill-light-static: #ececed;
--pd-global-color-dark-neutral-900: #bcbcbf;
--pd-non-semantic-color-tangerine-orange-92: #ff9529;
--pd-non-semantic-color-electric-blue-140: #183bab;
--pd-non-semantic-color-avocado-green-48: #dae380;
--pd-puco-global-color-black-40pc: rgba(25,36,53,.4);
--pd-global-color-light-yellow-700: #945b00;
--pd-non-semantic-color-emerald-green-124: #007e4f;
--pd-global-color-dark-red-1000: #fedad7;
--pd-color-active-background-strong: #bcdaff;
--pd-global-color-light-neutral-100: #f5f5f6;
--pd-color-warning-background: #df971c;
--pd-puco-color-text-link-light-inverted: #fff;
--pd-puco-global-color-green-800: #11402e;
--pd-global-color-dark-green-100: #012710;
--pd-non-semantic-color-avocado-green-108: #a3b308;
--pd-global-color-dark-yellow-800: #d18f3b;
--pd-puco-global-color-purple-600: #6861f2;
--pd-global-color-dark-red-400: #9a1b21;
--pd-global-color-light-purple-800: #5345bf;
--pd-global-color-dark-purple-1000: #e5dff7;
--pd-non-semantic-color-lavender-purple-24: #d9ceee;
--pd-puco-color-button-nova-hover: #edab0a;
--pd-non-semantic-color-lilac-purple-32: #eab0e8;
--pd-color-positive-background: #ddf4db;
--pd-non-semantic-color-electric-blue-24: #cedaff;
--pd-non-semantic-color-avocado-green-88: #bac92a;
--pd-color-negative-hover: #c82627;
--pd-global-color-dark-blue-800: #6e9dec;
--pd-non-semantic-color-tangerine-orange-72: #ffad58;
--pd-color-fill-on-inverted-light: hsla(0,0%,100%,.08);
--pd-non-semantic-color-bubblegum-pink-140: #910d48;
--pd-non-semantic-color-neutral-gray-56: #a1a3a3;
--pd-non-semantic-color-bubblegum-pink-92: #c5417c;
--pd-color-warning-background-light: #fff6d6;
--pd-non-semantic-color-tangerine-orange-20: #ffe8d0;
--pd-global-color-light-green-300: #bedfbd;
--pd-global-color-light-green-400: #82b886;
--pd-color-positive-hover: #077838;
--pd-color-surface-black-static: #3f424a;
--pd-non-semantic-color-teal-green-48: #81d1d0;
--pd-puco-global-color-neutral-300: #999fa7;
--pd-non-semantic-color-neutral-gray-92: #646768;
--pd-puco-color-surface-dark-rgba: rgba(25,36,53,.4);
--pd-color-icon-secondary-rgba: rgba(33,35,44,.72);
--pd-non-semantic-color-lavender-purple-108: #5a30a8;
--pd-color-brand-landing-growth: #aee9b4;
--pd-puco-color-visuals-medium-neutral: #dadde1;
--pd-non-semantic-color-bubblegum-pink-148: #890540;
--pd-global-color-dark-neutral-100: #1e2029;
--pd-color-secondary-extra-strong: #211c52;
--pd-non-semantic-color-sky-blue-116: #1673aa;
--pd-global-color-light-red-500: #f16a60;
--pd-puco-color-fill-white: #fff;
--pd-non-semantic-color-emerald-green-8: #e7f9f3;
--pd-puco-color-surface-secondary-gradient-background: linear-gradient(112deg,#f5f6fe 14.56%,#d7f9d3 71.31%,#85da95 111.62%);
--pd-global-color-brand-purple-100: #f8f8fe;
--pd-color-surface-inverted-strong: #21232c;
--pd-non-semantic-color-earth-brown-64: #be9577;
--pd-non-semantic-color-bubblegum-pink-72: #e4609b;
--pd-color-primary-border: #82b886;
--pd-puco-color-icon-secondary-link: #0070d6;
--pd-color-primary-background-strong: #bedfbd;
--pd-non-semantic-color-electric-blue-116: #3154c4;
--pd-non-semantic-color-lavender-purple-16: #e6dff3;
--pd-global-color-dark-blue-200: #012a60;
--pd-color-fill-medium-light-rgba: rgba(33,35,44,.12);
--pd-global-color-light-blue-800: #0157ae;
--pd-puco-global-color-neutral-100: #edeef0;
--pd-color-fill-light: #edeef0;
--pd-non-semantic-color-neutral-gray-140: #343637;
--pd-puco-color-surface-medium-background: #017737;
--pd-non-semantic-color-watermelon-red-72: #ff7174;
--pd-non-semantic-color-avocado-green-132: #788400;
--pd-non-semantic-color-lemon-yellow-32: #fbef95;
--pd-non-semantic-color-sky-blue-8: #e9f7ff;
--pd-non-semantic-color-honey-yellow-88: #fec425;
--pd-non-semantic-color-neutral-gray-132: #3b3d3e;
--pd-global-color-dark-yellow-300: #4f2e00;
--pd-color-negative-border: #fb8b80;
--pd-global-color-brand-purple-200: #e7e7fc;
--pd-color-icon-link-inverted: hsla(0,0%,100%,.72);
--pd-color-brand-growth-primary: #d7f9d3;
--pd-non-semantic-color-earth-brown-8: #f7f2ee;
--pd-color-active-default: #017737;
--pd-puco-color-icon-third: #999fa7;
--pd-global-color-light-blue-200: #e1eeff;
--pd-color-icon-negative: #ff5550;
--pd-non-semantic-color-honey-yellow-8: #fffaeb;
--pd-global-color-light-green-1000: #012a12;
--pd-non-semantic-color-avocado-green-72: #c6d34f;
--pd-color-warning-background-strong: #ffd24a;
--pd-non-semantic-color-lilac-purple-56: #cd7fca;
--pd-non-semantic-color-emerald-green-16: #d3f2e7;
--pd-color-fill-on-inverted-strong: hsla(0,0%,100%,.24);
--pd-non-semantic-color-avocado-green-64: #cdd95e;
--pd-non-semantic-color-tangerine-orange-64: #ffb66a;
--pd-color-divider-strong: #c8ccd2;
--pd-non-semantic-color-tangerine-orange-80: #ffa446;
--pd-non-semantic-color-neutral-gray-88: #6b6e6f;
--pd-puco-global-color-purple-5: #ededff;
--pd-puco-color-surface-dark-background: #0e5236;
--pd-global-color-light-neutral-600: #73767c;
--pd-non-semantic-color-watermelon-red-4: #fff8f8;
--pd-non-semantic-color-neutral-gray-124: #424445;
--pd-non-semantic-color-lemon-yellow-40: #fbec77;
--pd-global-color-light-green-500: #61a36b;
--pd-color-positive-border: #82b886;
--pd-non-semantic-color-earth-brown-80: #ae7a55;
--pd-global-color-dark-neutral-600: #72747a;
--pd-non-semantic-color-lemon-yellow-80: #efd516;
--pd-non-semantic-color-lemon-yellow-48: #fce854;
--pd-non-semantic-color-tangerine-orange-140: #a25200;
--pd-color-positive-default: #2d8647;
--pd-non-semantic-color-teal-green-116: #117d7b;
--pd-non-semantic-color-sky-blue-132: #036198;
--pd-non-semantic-color-tangerine-orange-16: #ffeddb;
--pd-non-semantic-color-tangerine-orange-48: #ffc88f;
--pd-color-other-backdrop: rgba(33,35,44,.48);
--pd-color-text-link-muted: #72adff;
--pd-puco-color-visuals-neutral: #fff;
--pd-puco-color-fill-extra-black-static: #192435;
--pd-non-semantic-color-watermelon-red-100: #e94346;
--pd-non-semantic-color-earth-brown-24: #e7d7cc;
--pd-puco-color-surface-default: #fff;
--pd-non-semantic-color-watermelon-red-56: #ff9193;
--pd-non-semantic-color-teal-green-100: #1c918f;
--pd-non-semantic-color-lavender-purple-92: #6f44bd;
--pd-non-semantic-color-bubblegum-pink-132: #98144f;
--pd-global-color-dark-red-200: #620000;
--pd-non-semantic-color-neutral-gray-12: #ebebeb;
--pd-color-icon-secondary: #656e7a;
--pd-color-divider-medium-rgba: rgba(33,35,44,.12);
--pd-global-color-light-red-200: #fde7e4;
--pd-global-color-dark-green-700: #5d9867;
--pd-non-semantic-color-sky-blue-32: #aedcf7;
--pd-non-semantic-color-emerald-green-92: #1ea874;
--pd-color-icon-learn: #6150e1;
--pd-non-semantic-color-sky-blue-12: #dff2fd;
--pd-non-semantic-color-honey-yellow-72: #fecf4c;
--pd-color-positive-muted: #82b886;
--pd-puco-color-active-secondary: #2cab53;
--pd-global-color-light-neutral-800: #565961;
--pd-non-semantic-color-teal-green-8: #e9f8f8;
--pd-non-semantic-color-lemon-yellow-72: #f4da1b;
--pd-color-secondary-background: #eeeafb;
--pd-global-color-light-yellow-100: #fff6d6;
--pd-color-icon-muted-inverted: hsla(0,0%,100%,.48);
--pd-non-semantic-color-electric-blue-132: #2043b3;
--pd-non-semantic-color-sky-blue-80: #43a1d9;
--pd-color-other-note: #fff6d6;
--pd-non-semantic-color-lilac-purple-100: #92288e;
--pd-non-semantic-color-teal-green-140: #085b59;
--pd-global-color-light-blue-600: #2b74da;
--pd-non-semantic-color-honey-yellow-92: #fec11b;
--pd-color-warning-border: #e69b00;
--pd-non-semantic-color-watermelon-red-88: #ff6164;
--pd-color-icon-active-muted: #72adff;
--pd-non-semantic-color-watermelon-red-132: #b12628;
--pd-color-fill-extra-black-static: #21232c;
--pd-non-semantic-color-lavender-purple-100: #6234b7;
--pd-non-semantic-color-bubblegum-pink-20: #f7d3e3;
--pd-non-semantic-color-watermelon-red-116: #d63033;
--pd-global-color-dark-blue-700: #588adf;
--pd-non-semantic-color-lavender-purple-12: #ece7f6;
--pd-non-semantic-color-lemon-yellow-116: #bea800;
--pd-non-semantic-color-lilac-purple-8: #fbeafb;
--pd-non-semantic-color-honey-yellow-16: #fff4d7;
--pd-puco-global-color-blue-400: #0070d6;
--pd-non-semantic-color-emerald-green-4: #f4fbfc;
--pd-non-semantic-color-emerald-green-100: #129c68;
--pd-non-semantic-color-lemon-yellow-100: #e1c708;
--pd-non-semantic-color-lavender-purple-4: #f9f7fc;
--pd-non-semantic-color-lemon-yellow-16: #fef7c5;
--pd-non-semantic-color-avocado-green-92: #b6c623;
--pd-non-semantic-color-lavender-purple-64: #9b7dd1;
--pd-puco-color-text-buttons: #413d99;
--pd-color-fill-strong-rgba: rgba(33,35,44,.48);
--pd-color-warning-strong: #ffab00;
--pd-global-color-dark-yellow-1000: #ffdf8c;
--pd-global-color-dark-neutral-0: #0e1017;
--pd-non-semantic-color-lilac-purple-72: #b462b1;
--pd-non-semantic-color-lavender-purple-48: #b49edd;
--pd-global-color-light-red-600: #d83c38;
--pd-non-semantic-color-bubblegum-pink-16: #f7dde9;
--pd-global-color-light-blue-900: #013f88;
--pd-non-semantic-color-bubblegum-pink-64: #f16da8;
--pd-color-brand-landing-primary: #ebfce9;
--pd-puco-color-visuals-growth-green: #017737;
--pd-non-semantic-color-honey-yellow-32: #ffeab0;
--pd-color-secondary-strong: #6150e1;
--pd-color-surface-dark-static: #565961;
--pd-non-semantic-color-avocado-green-140: #6a7500;
--pd-non-semantic-color-avocado-green-16: #f3f8ca;
--pd-color-text-muted: #999fa7;
--pd-global-color-dark-green-500: #2a7742;
--pd-non-semantic-color-neutral-gray-16: #e4e5e5;
--pd-puco-color-surface-secondary-background: #f7f7fe;
--pd-puco-global-color-neutral-50: #f4f5f6;
--pd-non-semantic-color-neutral-gray-64: #939596;
--pd-non-semantic-color-honey-yellow-132: #ad8005;
--pd-global-color-light-red-1000: #510000;
--pd-non-semantic-color-earth-brown-88: #a66d44;
--pd-puco-color-surface-default-background: #fff;
--pd-non-semantic-color-lavender-purple-116: #522c9a;
--pd-non-semantic-color-lavender-purple-72: #8e6dcb;
--pd-color-icon-warning: #ffab00;
--pd-non-semantic-color-lilac-purple-116: #7d2179;
--pd-global-color-brand-purple-400: #252745;
--pd-non-semantic-color-lemon-yellow-108: #d1b800;
--pd-non-semantic-color-earth-brown-148: #502e16;
--pd-non-semantic-color-neutral-gray-8: #f2f2f2;
--pd-global-color-light-purple-100: #f6f4fe;
--pd-global-color-light-neutral-200: #ececed;
--pd-color-negative-background-strong: #fdc9c2;
--pd-puco-color-primary-background: #c4ead2;
--pd-non-semantic-color-lilac-purple-4: #fdf4fd;
--pd-puco-color-button-nova-default: #ffde00;
--pd-non-semantic-color-teal-green-64: #62bebc;
--pd-color-learn-background: #eeeafb;
--pd-non-semantic-color-earth-brown-16: #efe4dd;
--pd-non-semantic-color-bubblegum-pink-48: #f88fbe;
--pd-color-fill-base: #fff;
--pd-non-semantic-color-lilac-purple-80: #aa51a6;
--pd-non-semantic-color-honey-yellow-24: #ffefc3;
--pd-non-semantic-color-teal-green-20: #caecec;
--pd-color-negative-muted: #fb8b80;
--pd-puco-color-surface-cta: #ffdf5c;
--pd-non-semantic-color-lemon-yellow-20: #fdf5be;
--pd-color-icon-black-static: #21232c;
--pd-color-secondary-background-light: #f6f4fe;
--pd-global-color-light-purple-900: #3d348e;
--pd-global-color-light-red-300: #fdc9c2;
--pd-non-semantic-color-tangerine-orange-132: #b85d00;
--pd-non-semantic-color-electric-blue-108: #395ccc;
--pd-non-semantic-color-emerald-green-88: #23ad79;
--pd-non-semantic-color-electric-blue-20: #d6e0ff;
--pd-non-semantic-color-neutral-gray-100: #575a5b;
--pd-non-semantic-color-avocado-green-80: #c1cf38;
--pd-global-color-light-yellow-900: #603900;
--pd-global-color-light-blue-400: #72adff;
--pd-global-color-dark-neutral-500: #686970;
--pd-non-semantic-color-lemon-yellow-92: #e6cc0d;
--pd-non-semantic-color-neutral-gray-48: #aeb0b0;
--pd-non-semantic-color-electric-blue-56: #8da8ff;
--pd-non-semantic-color-tangerine-orange-56: #ffbf7c;
--pd-non-semantic-color-lilac-purple-140: #5d155a;
--pd-non-semantic-color-watermelon-red-8: #ffefef;
--pd-non-semantic-color-neutral-gray-32: #c9cacb;
--pd-color-icon-secondary-inverted: hsla(0,0%,100%,.72);
--pd-non-semantic-color-electric-blue-16: #dee6ff;
--pd-non-semantic-color-neutral-gray-4: #f8f8f8;
--pd-non-semantic-color-lemon-yellow-124: #ac9800;
--pd-global-color-dark-yellow-100: #331c00;
--pd-global-color-light-blue-700: #0d68c5;
--pd-non-semantic-color-teal-green-80: #41aaa8;
--pd-puco-global-color-blue-0: #e8f5ff;
--pd-global-color-light-blue-300: #bcdaff;
--pd-puco-global-color-purple-0: #f7f7fe;
--pd-non-semantic-color-bubblegum-pink-24: #f7c9dd;
--pd-color-warning-default: #df971c;
--pd-color-primary-extra-strong: #00672a;
--pd-puco-color-text-link-medium-inverted: hsla(0,0%,100%,.72);
--pd-non-semantic-color-avocado-green-115: #95a400;
--pd-color-negative-strong: #c82627;
--pd-global-color-light-red-700: #c82627;
--pd-non-semantic-color-bubblegum-pink-8: #faeef3;
--pd-non-semantic-color-emerald-green-148: #005635;
--pd-global-color-dark-blue-100: #001f4b;
--pd-non-semantic-color-emerald-green-56: #6ad0a9;
--pd-non-semantic-color-neutral-gray-148: #2d2f2f;
--pd-puco-global-color-green-12: #e3fae1;
--pd-puco-global-color-neutral-600: #656e7a;
--pd-non-semantic-color-earth-brown-116: #814b24;
--pd-color-text-white-static: #fff;
--pd-global-color-dark-blue-300: #023372;
--pd-global-color-dark-neutral-400: #4c4f55;
--pd-non-semantic-color-sky-blue-20: #cde9fa;
--pd-puco-global-color-neutral-150: #e4e6e9;
--pd-non-semantic-color-emerald-green-72: #45c091;
--pd-puco-global-color-purple-300: #c4c2ff;
--pd-puco-global-color-dark-green: #0e5236;
--pd-color-positive-strong: #077838;
--pd-color-info-background-light: #e8f5ff;
--pd-non-semantic-color-honey-yellow-148: #846204;
--pd-global-color-dark-purple-300: #2c2b75;
--pd-non-semantic-color-earth-brown-72: #b68766;
--pd-puco-color-surface-nova-gradient-background: linear-gradient(88deg,#66197c -12.84%,#5343ad 59.33%,#451e6a 126.68%,#1d0854 147.53%);
--pd-puco-global-color-yellow-750: #fc0;
--pd-color-primary-background: #ddf4db;
--pd-non-semantic-color-electric-blue-124: #284bbb;
--pd-color-learn-border: #ab9ffb;
--pd-non-semantic-color-teal-green-32: #abe1e0;
--pd-non-semantic-color-lemon-yellow-88: #ead011;
--pd-global-color-light-purple-200: #eeeafb;
--pd-global-color-dark-red-500: #c03737;
--pd-global-color-light-purple-700: #6150e1;
--pd-color-text-muted-rgba: rgba(33,35,44,.48);
--pd-color-primary-muted: #61c786;
--pd-global-color-dark-blue-1000: #d3e3fe;
--pd-color-other-highlight: #ffd24a;
--pd-puco-color-divider-third: #fff;
--pd-non-semantic-color-electric-blue-148: #1033a3;
--pd-global-color-dark-neutral-300: #33353e;
--pd-global-color-dark-blue-900: #9abefa;
--pd-puco-global-color-red-300: #ff5550;
--pd-global-color-light-purple-600: #6962f2;
--pd-global-color-brand-green-200: #d7f9d3;
--pd-color-text-info: #005ab0;
--pd-color-secondary-muted: #ab9ffb;
--pd-global-color-light-neutral-1000: #21232c;
--pd-non-semantic-color-avocado-green-148: #5c6600;
--pd-color-icon-info: #005ab0;
--pd-non-semantic-color-sky-blue-140: #00578a;
--pd-non-semantic-color-lilac-purple-108: #872484;
--pd-non-semantic-color-neutral-gray-116: #494c4c;
--pd-non-semantic-color-lemon-yellow-4: #fffdf1;
--pd-color-positive-extra-strong: #00672a;
--pd-color-fill-dark-static: #192435;
--pd-non-semantic-color-tangerine-orange-108: #ef800e;
--pd-non-semantic-color-emerald-green-40: #95ddc2;
--pd-color-divider-light-rgba: rgb(33 35 44/8%);
--pd-color-text-link: #0d6ece;
--pd-color-learn-default: #6962f2;
--pd-global-color-light-green-100: #e9fbe7;
--pd-global-color-dark-red-100: #4c0000;
--pd-puco-color-divider-primary: #e4e6e9;
--pd-non-semantic-color-honey-yellow-124: #c18f05;
--pd-global-color-dark-red-600: #cc4543;
--pd-global-color-light-yellow-600: #a76800;
--pd-non-semantic-color-tangerine-orange-100: #fc8d1b;
--pd-puco-color-icon-link-primary: #192435;
--pd-global-color-brand-purple-300: #3b3a97;
--pd-color-text-muted-inverted: hsla(0,0%,100%,.48);
--pd-non-semantic-color-sky-blue-16: #d4eefd;
--pd-non-semantic-color-avocado-green-56: #d4de6f;
--pd-puco-color-divider-default: #e1e1ff;
--pd-color-icon-link: #0d68c5;
--pd-non-semantic-color-lilac-purple-16: #f5d8f4;
--pd-color-active-hover: #0d68c5;
--pd-puco-color-visuals-warm: #fc0;
--pd-color-fill-base-secondary: #f5f5f6;
--pd-non-semantic-color-sky-blue-148: #004b77;
--pd-color-text-learn: #6150e1;
--pd-color-surface-foreground-secondary: #f5f5f6;
--pd-global-color-dark-red-700: #e0645e;
--pd-global-color-dark-yellow-200: #432600;
--pd-non-semantic-color-lavender-purple-148: #331b5f;
--pd-color-active-background: #d7f9d3;
--pd-non-semantic-color-honey-yellow-56: #ffda74;
--pd-non-semantic-color-teal-green-88: #32a09e;
--pd-color-fill-white-muted-static: hsla(0,0%,100%,.48);
--pd-non-semantic-color-lilac-purple-64: #c26fbf;
--pd-global-color-light-purple-500: #9086fc;
--pd-non-semantic-color-sky-blue-48: #82cbf5;
--pd-non-semantic-color-earth-brown-4: #fbf8f7;
--pd-non-semantic-color-electric-blue-88: #5477e7;
--pd-puco-global-color-blue-500: #005ab0;
--pd-puco-global-color-neutral-inverted-600: hsla(0,0%,100%,.72);
--pd-global-color-dark-purple-400: #45449b;
--pd-non-semantic-color-honey-yellow-100: #febc07;
--pd-global-color-light-green-600: #2d8647;
--pd-non-semantic-color-honey-yellow-12: #fff7e1;
--pd-non-semantic-color-emerald-green-132: #007046;
--pd-non-semantic-color-honey-yellow-116: #d59e06;
--pd-non-semantic-color-lilac-purple-24: #edc6eb;
--pd-non-semantic-color-electric-blue-32: #bdcdff;
--pd-color-text-positive: #017737;
--pd-color-info-border: #72adff;
--pd-color-fill-medium-light: #ececed;
--pd-non-semantic-color-teal-green-132: #0a6765;
--pd-non-semantic-color-earth-brown-108: #8e5228;
--pd-global-color-light-blue-100: #eff6ff;
--pd-color-active-background-light: #e3fae1;
--pd-puco-global-color-neutral-200: #dadde1;
--pd-non-semantic-color-bubblegum-pink-80: #d8548f;
--pd-non-semantic-color-watermelon-red-20: #ffd7d8;
--pd-non-semantic-color-watermelon-red-48: #ffa0a2;
--pd-puco-color-primary-secondary: #e1e1ff;
--pd-puco-color-visuals-light: #f6f7f8;
--pd-global-color-light-purple-1000: #211c52;
--pd-non-semantic-color-teal-green-40: #95d9d8;
--pd-non-semantic-color-bubblegum-pink-88: #ca4681;
--pd-global-color-light-neutral-900: #3f424a;
--pd-puco-global-color-green-300: #2cab53;
--pd-global-color-dark-green-800: #76a97c;
--pd-global-color-dark-blue-400: #244d92;
--pd-global-color-light-yellow-500: #cf8501;
--pd-color-fill-extra-light-rgba: rgb(33 35 44/5%);
--pd-non-semantic-color-lavender-purple-40: #c0aee2;
--pd-color-fill-light-rgba: rgb(33 35 44/8%);
--pd-non-semantic-color-lilac-purple-40: #e29fe0;
--pd-global-color-dark-green-600: #3c824e;
--pd-puco-color-surface-tertiary-background: #e1e1ff;
--pd-non-semantic-color-lilac-purple-92: #9c3898;
--pd-non-semantic-color-teal-green-16: #d7efef;
--pd-global-color-light-blue-1000: #002252;
--pd-puco-color-surface-light-background: #d7f9d3;
--pd-non-semantic-color-honey-yellow-20: #fff2cd;
--pd-non-semantic-color-watermelon-red-40: #ffb0b2;
--pd-global-color-dark-yellow-700: #bc7e33;
--pd-global-color-dark-neutral-1000: #e2e2e4;
--pd-color-brand-growth-secondary: #e7e7fc;
--pd-non-semantic-color-lilac-purple-132: #671864;
--pd-puco-color-button-nova-disabled: #fff9bd;
--pd-global-color-dark-green-1000: #d1e8cf;
--pd-color-negative-background: #ffe7e6;
--pd-non-semantic-color-tangerine-orange-12: #fff1e3;
--pd-non-semantic-color-bubblegum-pink-124: #a11d58;
--pd-animation-transition-slow-color: .4s cubic-bezier(.5,0,.2,1);
--pd-puco-color-text-link-dark: #192435;
--pd-global-color-light-blue-500: #5195f6;
--pd-non-semantic-color-teal-green-124: #0b7271;
--pd-non-semantic-color-neutral-gray-24: #d7d7d8;
--pd-color-navigation-divider: #6150e1;
--pd-non-semantic-color-emerald-green-24: #c1e9db;
--pd-global-color-light-yellow-1000: #371e00;
--pd-non-semantic-color-avocado-green-4: #fdfeef;
--pd-non-semantic-color-honey-yellow-48: #ffdf88;
--pd-non-semantic-color-sky-blue-64: #60b7ea;
--pd-non-semantic-color-teal-green-72: #50b5b3;
--pd-color-icon-primary: #192435;
--pd-color-secondary-hover: #6150e1;
--pd-non-semantic-color-lavender-purple-32: #cdbee8;
--pd-non-semantic-color-watermelon-red-12: #ffe7e7;
--pd-non-semantic-color-earth-brown-92: #a2663c;
--pd-puco-color-button-nova-text: #192435;
--pd-non-semantic-color-lilac-purple-48: #d88fd5;
--pd-global-color-light-green-800: #00672a;
--pd-puco-color-surface-black-static: #2a3647;
--pd-color-fill-extra-strong-rgba: rgba(33,35,44,.72);
--pd-non-semantic-color-tangerine-orange-88: #ff9a33;
--pd-non-semantic-color-emerald-green-20: #ccede1;
--pd-puco-global-color-purple-240: #e1e1ff;
--pd-puco-global-color-neutral-850: #192435;
--pd-global-color-light-green-200: #ddf4db;
--pd-puco-global-color-white-16pc: hsla(0,0%,100%,.16);
--pd-non-semantic-color-electric-blue-40: #adc1ff;
--pd-puco-color-primary-extra-light: #ededff;
--pd-non-semantic-color-earth-brown-124: #754421;
--pd-non-semantic-color-teal-green-92: #2b9b99;
--pd-global-color-dark-neutral-800: #9c9da1;
--pd-color-navigation-hover: #6962f2;
--pd-non-semantic-color-electric-blue-72: #6c8fff;
--pd-puco-color-text-link-medium: #656e7a;
--pd-non-semantic-color-lilac-purple-20: #f0cfee;
--pd-non-semantic-color-emerald-green-116: #008a56;
--pd-non-semantic-color-teal-green-108: #178684;
--pd-non-semantic-color-watermelon-red-24: #ffd0d1;
--pd-color-text-active-muted: #72adff;
--pd-non-semantic-color-bubblegum-pink-40: #f7a3c8;
--pd-puco-color-fill-muted: #999fa7;
--pd-non-semantic-color-teal-green-24: #bfe9e8;
--pd-global-color-brand-green-400: #014722;
--pd-non-semantic-color-avocado-green-12: #f7f9d5;
--pd-animation-transition-fast-color: .3s cubic-bezier(.5,0,.2,1);
--pd-color-secondary-border: #ab9ffb;
--pd-non-semantic-color-lemon-yellow-140: #887800;
--pd-global-color-dark-red-300: #720002;
--pd-puco-color-fill-inverted-light: hsla(0,0%,100%,.16);
--pd-non-semantic-color-sky-blue-100: #2785bc;
--pd-global-color-dark-purple-500: #5e59d2;
--pd-global-color-dark-yellow-900: #eeb245;
--pd-non-semantic-color-bubblegum-pink-100: #b8346f;
--pd-non-semantic-color-tangerine-orange-148: #8c4700;
--pd-puco-global-color-green-25: #d7f9d3;
--pd-global-color-light-red-900: #8a0007;
--pd-puco-global-color-green-700: #0e5235;
--pd-non-semantic-color-neutral-gray-80: #797b7c;
--pd-color-secondary-background-strong: #d9d1f8;
--pd-non-semantic-color-lilac-purple-12: #f7e1f6;
--pd-puco-color-surface-neutral: rgba(25,36,53,.4);
--pd-puco-global-color-purple-700: #413d99;
--pd-color-icon-positive: #017737;
--pd-color-surface-overlay: #fff;
--pd-global-color-dark-green-200: #013417;
--pd-puco-global-color-blue-800: #0d6ece;
--pd-global-color-dark-red-900: #f9a7a0;
--pd-global-color-light-yellow-800: #804d00;
--pd-non-semantic-color-earth-brown-48: #cfaf99;
--pd-global-color-light-purple-400: #ab9ffb;
--pd-non-semantic-color-emerald-green-48: #7fd6b6;
--pd-global-color-dark-green-900: #a0c6a1;
--pd-non-semantic-color-bubblegum-pink-4: #fff7f8;
--pd-puco-color-surface-purple-light-gradient-background: linear-gradient(142deg,#f5f6fe 27.79%,#cfd0f9 86.53%);
--pd-color-icon-muted-rgba: rgba(33,35,44,.48);
--pd-global-color-dark-green-300: #013e1d;
--pd-non-semantic-color-earth-brown-20: #ebded5;
--pd-non-semantic-color-watermelon-red-148: #8f191b;
--pd-non-semantic-color-tangerine-orange-116: #e27301;
--pd-non-semantic-color-earth-brown-56: #c6a288;
--pd-non-semantic-color-emerald-green-32: #aae4ce;
```

### Spacing

```css
--pd-size-800: 64px;
--pd-puco-size-icon-xl: 60px;
--pd-spacing-75: 6px;
--pd-font-body-s-strong-font-size: 12px;
--pd-puco-spacing-none: 0px;
--pd-size-400: 32px;
--pd-font-monospace-font-stretch: normal;
--pd-puco-size-icon-xxl: 80px;
--pd-font-link-letter-spacing: 0;
--pd-puco-size-icon-xxs: 16px;
--pd-font-body-letter-spacing: 0;
--pd-size-300: 24px;
--pd-font-body-l-strong-letter-spacing: 0;
--pd-font-body-strong-font-size: 14px;
--pd-puco-spacing-l: 40px;
--pd-font-monospace-paragraph-spacing: 28px;
--pd-size-700: 56px;
--pd-puco-font-website-h6-both-font-size: 20px;
--pd-puco-icon-svg-size-xl: 30px;
--pd-font-monospace-font-style: normal;
--pd-font-body-s-strong-paragraph-spacing: 24px;
--pd-puco-font-website-body-strong-font-size: 18px;
--pd-puco-font-website-body-font-size: 18px;
--pd-puco-font-website-body-xs-font-size: 12px;
--pd-spacing-600: 48px;
--pd-font-link-s-font-size: 12px;
--pd-font-title-m-letter-spacing: 0;
--pd-font-button-font-size: 14px;
--pd-font-caption-s-font-size: 11px;
--pd-font-body-l-letter-spacing: 0;
--pd-puco-icon-svg-size-m: 16px;
--pd-puco-font-button-s-font-size: 14px;
--pd-font-body-strong-letter-spacing: 0;
--pd-font-link-alt-paragraph-spacing: 28px;
--pd-size-100: 8px;
--pd-spacing-400: 32px;
--pd-font-title-xl-font-size: 21px;
--pd-font-caption-s-paragraph-spacing: 22px;
--pd-font-link-paragraph-spacing: 28px;
--pd-puco-font-button-m-font-size: 18px;
--pd-size-200: 16px;
--pd-size-50: 4px;
--pd-size-25: 2px;
--pd-puco-font-website-h5-both-font-size: 22px;
--pd-puco-font-website-body-s-font-size: 14px;
--pd-size-75: 6px;
--pd-font-body-s-paragraph-spacing: 24px;
--pd-font-title-xl-paragraph-spacing: 42px;
--pd-font-monospace-text-decoration: none;
--pd-font-body-font-size: 14px;
--pd-font-body-s-letter-spacing: 0;
--pd-font-monospace-font: 400 14px/22px "Menlo",consolas,courier,monospace;
--pd-spacing-800: 56px;
--pd-puco-font-website-h4-both-font-size: 24px;
--pd-font-body-s-strong-letter-spacing: 0;
--pd-font-body-l-paragraph-spacing: 32px;
--pd-font-link-font-size: 14px;
--pd-puco-spacing-s: 10px;
--pd-spacing-100: 8px;
--pd-puco-size-icon-l: 48px;
--pd-puco-font-website-h2-desktop-font-size: 36px;
--pd-spacing-150: 12px;
--pd-puco-spacing-xs: 5px;
--pd-puco-size-icon-xs: 24px;
--pd-puco-font-website-body-sm-font-size: 16px;
--pd-spacing-500: 40px;
--pd-font-button-letter-spacing: 0;
--pd-spacing-200: 16px;
--pd-puco-font-website-h2-mobile-font-size: 30px;
--pd-font-title-m-paragraph-spacing: 28px;
--pd-font-body-paragraph-spacing: 28px;
--pd-font-body-l-strong-font-size: 16px;
--pd-spacing-25: 2px;
--pd-puco-size-icon-s: 32px;
--pd-puco-icon-svg-size-xxl: 42px;
--pd-puco-font-website-body-xl-font-size: 110px;
--pd-puco-spacing-m: 20px;
--pd-puco-icon-svg-size-l: 24px;
--pd-size-150: 12px;
--pd-font-link-alt-font-size: 14px;
--pd-font-monospace-line-height: 22px;
--pd-font-button-paragraph-spacing: 28px;
--pd-font-badge-font-size: 10px;
--pd-font-monospace-text-case: none;
--pd-font-link-s-paragraph-spacing: 24px;
--pd-font-body-s-font-size: 12px;
--pd-puco-font-website-h3-desktop-font-size: 30px;
--pd-font-link-alt-s-letter-spacing: 0;
--pd-size-600: 48px;
--pd-font-monospace-font-size: 14px;
--pd-font-title-xxl-font-size: 25px;
--pd-spacing-10: 1px;
--pd-font-badge-letter-spacing: .2px;
--pd-font-monospace-font-family: "Menlo",consolas,courier,monospace;
--pd-puco-font-website-h3-mobile-font-size: 28px;
--pd-puco-icon-svg-size-logo: 18px;
--pd-font-button-s-font-size: 12px;
--pd-font-monospace-font-weight: 400;
--pd-font-monospace-font-style-old: regular;
--pd-size-10: 1px;
--pd-font-body-strong-paragraph-spacing: 28px;
--pd-puco-font-website-h1-desktop-font-size: 52px;
--pd-font-caption-letter-spacing: 0;
--pd-puco-font-small-title-s-font-size: 16px;
--pd-font-title-xl-letter-spacing: 0;
--pd-font-title-l-paragraph-spacing: 32px;
--pd-puco-font-website-h1-mobile-font-size: 32px;
--pd-font-button-s-paragraph-spacing: 24px;
--pd-size-500: 40px;
--pd-font-button-s-letter-spacing: 0;
--pd-puco-font-button-l-font-size: 22px;
--pd-font-caption-s-letter-spacing: 0;
--pd-font-body-l-strong-paragraph-spacing: 32px;
--pd-font-title-l-font-size: 16px;
--pd-puco-font-small-title-m-font-size: 20px;
--pd-spacing-50: 4px;
--pd-font-title-xxl-letter-spacing: 0;
--pd-font-monospace-paragraph-indent: 0;
--pd-font-title-m-font-size: 14px;
--pd-spacing-300: 24px;
--pd-font-link-s-letter-spacing: 0;
--pd-font-body-l-font-size: 16px;
--pd-font-link-alt-s-paragraph-spacing: 24px;
--pd-font-caption-font-size: 13px;
--pd-puco-spacing-xl: 80px;
--pd-spacing-700: 56px;
--pd-puco-size-icon-m: 36px;
--pd-font-title-xxl-paragraph-spacing: 50px;
--pd-font-link-alt-s-font-size: 12px;
--pd-font-badge-paragraph-spacing: 20px;
--pd-font-caption-paragraph-spacing: 26px;
--pd-font-title-l-letter-spacing: 0;
--pd-font-monospace-letter-spacing: 0;
--pd-size-0: 0;
--pd-font-link-alt-letter-spacing: 0;
```

### Typography

```css
--pd-font-button-text-case: none;
--pd-font-body-s-strong-font: 600 12px/18px "Inter",sans-serif;
--pd-font-link-font-weight: 600;
--pd-font-body-l-strong-font-style-old: semi bold;
--pd-font-link-alt-text-decoration: none;
--pd-puco-font-website-h1-mobile-font-weight: 700;
--pd-puco-font-website-h1-mobile-line-height: 42px;
--pd-font-badge-font-family: "Inter",sans-serif;
--pd-font-button-s-font: 600 12px/16px "Inter",sans-serif;
--pd-font-link-font-style: normal;
--pd-font-body-s-strong-text-case: none;
--pd-font-title-xl-text-case: none;
--pd-font-body-l-font-style-old: regular;
--pd-font-caption-font-style: normal;
--pd-font-link-alt-s-line-height: 18px;
--pd-puco-font-website-body-sm-strong-font-weight: 700;
--pd-puco-font-website-h2-mobile-line-height: 38px;
--pd-font-body-font-family: "Inter",sans-serif;
--pd-font-body-font-style: normal;
--pd-font-link-alt-font-style-old: regular;
--pd-puco-font-website-h6-both-font-weight: 700;
--pd-font-button-s-font-style-old: semi bold;
--pd-font-title-xxl-line-height: 38px;
--pd-font-caption-line-height: 20px;
--pd-puco-font-small-title-m-line-height: 30px;
--pd-font-link-s-paragraph-indent: 0;
--pd-font-body-font-weight: 450;
--pd-puco-font-website-body-s-line-height: 25px;
--pd-font-body-s-font-style: normal;
--pd-font-title-xxl-font-style: normal;
--pd-font-title-xl-font-stretch: normal;
--pd-font-title-xxl-paragraph-indent: 0;
--pd-font-body-font-style-old: regular;
--pd-font-badge-text-decoration: none;
--pd-font-body-l-strong-line-height: 24px;
--pd-font-title-xxl-font-style-old: regular;
--pd-puco-font-website-h3-desktop-line-height: 36px;
--pd-font-link-alt-s-text-case: none;
--pd-font-body-l-strong-font-stretch: normal;
--pd-font-link-text-decoration: none;
--pd-font-link-font: 600 14px/21px "Inter",sans-serif;
--pd-font-button-s-paragraph-indent: 0;
--pd-font-link-alt-s-font-stretch: normal;
--pd-font-body-s-font-weight: 450;
--pd-puco-font-website-body-font-weight: 400;
--pd-font-link-alt-s-font-weight: 450;
--pd-font-body-s-text-decoration: none;
--pd-font-body-strong-font-style-old: semi bold;
--pd-puco-font-button-l-line-height: 32px;
--pd-font-body-s-strong-font-weight: 600;
--pd-font-body-s-font-style-old: regular;
--pd-font-body-font: 450 14px/21px "Inter",sans-serif;
--pd-font-badge-text-case: uppercase;
--pd-font-link-text-case: none;
--pd-font-link-s-font-stretch: normal;
--pd-puco-font-website-body-xl-line-height: 120px;
--pd-font-body-s-font: 450 12px/18px "Inter",sans-serif;
--pd-font-title-l-font-weight: 600;
--pd-font-caption-font-family: "Inter",sans-serif;
--pd-font-body-text-case: none;
--pd-font-title-xxl-text-decoration: none;
--pd-font-body-s-paragraph-indent: 0;
--pd-font-title-xl-line-height: 32px;
--pd-font-link-alt-font-weight: 450;
--pd-font-link-font-stretch: normal;
--pd-font-body-strong-font-family: "Inter",sans-serif;
--pd-font-body-strong-font-stretch: normal;
--pd-font-caption-s-font-style: normal;
--pd-puco-font-website-body-sm-line-height: 25px;
--pd-font-body-l-font-family: "Inter",sans-serif;
--pd-font-link-alt-font-family: "Inter",sans-serif;
--pd-font-caption-s-line-height: 16px;
--pd-font-badge-font-stretch: normal;
--pd-puco-font-website-h1-desktop-line-height: 62px;
--pd-font-body-strong-font: 600 14px/21px "Inter",sans-serif;
--pd-puco-font-website-body-strong-600-font-weight: 600;
--pd-font-body-l-font: 450 16px/24px "Inter",sans-serif;
--pd-font-body-l-strong-paragraph-indent: 0;
--pd-font-caption-s-font-weight: 600;
--pd-font-body-s-strong-paragraph-indent: 0;
--pd-font-title-xl-font-weight: 400;
--pd-font-body-l-font-stretch: normal;
--pd-font-title-xl-paragraph-indent: 0;
--pd-font-title-m-paragraph-indent: 0;
--pd-font-button-s-font-family: "Inter",sans-serif;
--pd-font-title-m-text-case: none;
--pd-font-title-m-font-family: "Inter",sans-serif;
--pd-font-link-alt-font: 450 14px/21px "Inter",sans-serif;
--pd-puco-font-website-body-sm-font-weight: 400;
--pd-font-badge-paragraph-indent: 0;
--pd-font-link-alt-line-height: 21px;
--pd-font-button-font-style: normal;
--pd-font-button-s-line-height: 16px;
--pd-puco-font-website-h1-desktop-font-weight: 700;
--pd-font-link-s-text-case: none;
--pd-font-title-xxl-font: 400 25px/38px "Inter",sans-serif;
--pd-font-caption-s-font-style-old: semi bold;
--pd-font-title-xxl-font-weight: 400;
--pd-font-button-text-decoration: none;
--pd-puco-font-website-h3-mobile-line-height: 36px;
--pd-font-body-strong-text-case: none;
--pd-font-caption-s-font-family: "Inter",sans-serif;
--pd-font-badge-font-style: normal;
--pd-font-body-l-font-style: normal;
--pd-font-body-s-strong-font-family: "Inter",sans-serif;
--pd-font-caption-text-decoration: none;
--pd-font-body-l-text-decoration: none;
--pd-font-link-s-font-style-old: semi bold;
--pd-font-title-l-text-decoration: none;
--pd-font-button-font: 600 14px/20px "Inter",sans-serif;
--pd-puco-font-website-body-strong-font-weight: 700;
--pd-font-body-l-strong-text-case: none;
--pd-font-link-alt-text-case: none;
--pd-font-body-strong-text-decoration: none;
--pd-puco-font-button-m-line-height: 24px;
--pd-font-button-paragraph-indent: 0;
--pd-font-title-m-font-weight: 600;
--pd-font-title-l-font-stretch: normal;
--pd-font-button-font-weight: 600;
--pd-font-title-m-font-style-old: semi bold;
--pd-puco-font-small-title-m-font-weight: 700;
--pd-font-caption-font-weight: 600;
--pd-font-body-s-strong-font-style: normal;
--pd-font-body-l-paragraph-indent: 0;
--pd-font-caption-s-paragraph-indent: 0;
--pd-font-title-m-font-stretch: normal;
--pd-font-title-l-text-case: none;
--pd-font-link-alt-s-font-style: normal;
--pd-font-title-l-font-family: "Inter",sans-serif;
--pd-font-caption-font: 600 13px/20px "Inter",sans-serif;
--pd-font-link-alt-font-style: normal;
--pd-font-button-line-height: 20px;
--pd-font-body-s-line-height: 18px;
--pd-font-title-xl-font-style-old: regular;
--pd-font-button-s-text-case: none;
--pd-font-body-strong-line-height: 21px;
--pd-puco-font-button-font-weight: 700;
--pd-font-link-line-height: 21px;
--pd-font-link-s-line-height: 18px;
--pd-font-body-s-text-case: none;
--pd-font-link-s-font-style: normal;
--pd-font-title-xl-font-style: normal;
--pd-font-body-text-decoration: none;
--pd-font-title-xl-font: 400 21px/32px "Inter",sans-serif;
--pd-font-body-l-strong-font-family: "Inter",sans-serif;
--pd-font-caption-font-style-old: semi bold;
--pd-font-badge-font-weight: 600;
--pd-font-caption-s-font-stretch: normal;
--pd-font-title-m-text-decoration: none;
--pd-font-link-alt-paragraph-indent: 0;
--pd-font-button-s-font-weight: 600;
--pd-font-title-xl-text-decoration: none;
--pd-font-body-s-font-family: "Inter",sans-serif;
--pd-font-button-font-style-old: semi bold;
--pd-font-title-xxl-text-case: none;
--pd-font-body-l-text-case: none;
--pd-puco-font-website-body-xs-strong-600-font-weight: 600;
--pd-puco-font-small-title-s-font-weight: 700;
--pd-font-body-s-strong-line-height: 18px;
--pd-puco-font-website-h5-both-line-height: 33px;
--pd-font-button-s-text-decoration: none;
--pd-font-button-font-stretch: normal;
--pd-puco-font-website-body-xs-line-height: 22px;
--pd-font-link-s-text-decoration: none;
--pd-font-body-line-height: 21px;
--pd-font-link-alt-s-paragraph-indent: 0;
--pd-font-caption-paragraph-indent: 0;
--pd-font-title-xxl-font-family: "Inter",sans-serif;
--pd-font-title-l-font-style: normal;
--pd-font-body-l-strong-font-style: normal;
--pd-font-caption-text-case: uppercase;
--pd-puco-font-small-title-s-line-height: 24px;
--pd-font-button-s-font-stretch: normal;
--pd-puco-font-website-body-sm-strong-600-font-weight: 600;
--pd-font-body-l-font-weight: 450;
--pd-font-body-strong-paragraph-indent: 0;
--pd-font-link-alt-s-text-decoration: none;
--pd-font-badge-line-height: 16px;
--pd-font-button-s-font-style: normal;
--pd-font-body-font-stretch: normal;
--pd-font-title-l-font-style-old: semi bold;
--pd-puco-font-website-body-s-font-weight: 400;
--pd-font-link-alt-s-font-style-old: regular;
--pd-puco-font-website-h4-both-line-height: 36px;
--pd-font-body-l-strong-font: 600 16px/24px "Inter",sans-serif;
--pd-font-link-s-font-family: "Inter",sans-serif;
--pd-font-body-s-strong-text-decoration: none;
--pd-font-body-l-line-height: 24px;
--pd-font-caption-s-font: 600 11px/16px "Inter",sans-serif;
--pd-font-link-s-font-weight: 600;
--pd-puco-font-website-body-s-strong-font-weight: 700;
--pd-font-body-paragraph-indent: 0;
--pd-font-title-l-font: 600 16px/24px "Inter",sans-serif;
--pd-font-title-xxl-font-stretch: normal;
--pd-puco-font-website-h6-both-line-height: 30px;
--pd-font-link-alt-font-stretch: normal;
--pd-font-body-s-strong-font-style-old: semi bold;
--pd-font-body-l-strong-font-weight: 600;
--pd-font-body-s-strong-font-stretch: normal;
--pd-font-title-l-paragraph-indent: 0;
--pd-font-title-m-line-height: 21px;
--pd-font-badge-font-style-old: semi bold;
--pd-puco-font-website-body-line-height: 30px;
--pd-font-link-font-style-old: semi bold;
--pd-font-link-paragraph-indent: 0;
--pd-puco-font-website-body-xs-strong-font-weight: 700;
--pd-puco-font-website-body-xs-font-weight: 400;
--pd-puco-font-button-s-font-weight: 700;
--pd-puco-font-button-s-line-height: 16px;
--pd-font-title-m-font: 600 14px/21px "Inter",sans-serif;
--pd-font-link-font-family: "Inter",sans-serif;
--pd-font-body-l-strong-text-decoration: none;
--pd-font-body-strong-font-weight: 600;
--pd-font-title-m-font-style: normal;
--pd-font-title-l-line-height: 24px;
--pd-font-caption-font-stretch: normal;
--pd-font-link-alt-s-font: 450 12px/18px "Inter",sans-serif;
--pd-font-caption-s-text-case: uppercase;
--pd-puco-font-website-body-s-strong-600-font-weight: 600;
--pd-font-button-font-family: "Inter",sans-serif;
--pd-font-link-s-font: 600 12px/18px "Inter",sans-serif;
--pd-font-link-alt-s-font-family: "Inter",sans-serif;
--pd-puco-font-website-h2-desktop-line-height: 43px;
--pd-font-body-s-font-stretch: normal;
--pd-font-body-strong-font-style: normal;
--pd-font-badge-font: 600 10px/16px "Inter",sans-serif;
--pd-font-caption-s-text-decoration: none;
--pd-font-title-xl-font-family: "Inter",sans-serif;
```

### Radii

```css
--pd-radius-s: 4px;
--pd-radius-m: 4px;
--pd-radius-l: 8px;
--pd-radius-xs: 2px;
```

### Other

```css
--pd-puco-z-index-horizontal-nav: 100;
--pd-puco-button-height-s: 32px;
--pd-animation-exit-fast-position-opacity-position: .18s cubic-bezier(.7,0,1,1);
--pd-animation-enter-fast-time: .25s;
--pd-elevation-floating-high: 0 5px 5px rgba(0,0,0,.1),0 3px 14px rgb(0 0 0/6%),0 8px 10px rgb(0 0 0/5%),0 0 2px rgba(0,0,0,.24);
--pd-animation-exit-speedcurve: cubic-bezier(.7,0,1,1);
--pd-puco-transition-400-time: 0.4s;
--pd-puco-transition-curve-2: cubic-bezier(0.4,0,1,1);
--pd-puco-z-index-tooltip: 2000;
--pd-animation-transition-microinteraction-slow-time: .18s;
--pd-puco-transition-350-time: 0.35s;
--pd-puco-transition-320-time: 0.32s;
--pd-animation-exit-slow-position-opacity-opacity: opacity .17s cubic-bezier(.7,0,1,1);
--pd-animation-exit-scale-with-opacity-end: scale(.5);
--pd-animation-enter-slow-scale-opacity: opacity .3s cubic-bezier(0,0,.2,1),transform .35s cubic-bezier(0,0,.2,1);
--pd-puco-z-index-search-results: 1003;
--pd-puco-transition-200-time: 0.2s;
--pd-animation-exit-slow-scale: transform .22s cubic-bezier(.7,0,1,1);
--pd-elevation-topbar: 0 1px 3px rgb(0 0 0/7%),0 1px 2px rgb(0 0 0/6%),0 0 1px rgb(0 0 0/5%);
--pd-animation-exit-scale-end: scale(0);
--pd-puco-transition-250-time: 0.25s;
--pd-animation-enter-fast-opacity: opacity .25s cubic-bezier(0,0,.2,1);
--pd-animation-enter-opacity-start: 0;
--pd-animation-exit-fast-position: .18s cubic-bezier(.7,0,1,1);
--pd-animation-enter-slow-position-opacity-opacity: opacity .3s cubic-bezier(0,0,.2,1);
--pd-animation-exit-fast-position-opacity-opacity: opacity .14s cubic-bezier(.7,0,1,1);
--pd-animation-transition-fast-position-opacity-position: .3s cubic-bezier(.5,0,.2,1);
--pd-animation-exit-slow-time: .22s;
--pd-animation-transition-slow-scale: transform .4s cubic-bezier(.5,0,.2,1);
--pd-puco-transition-curve-3: cubic-bezier(0.4,0,0.2,1);
--pd-animation-enter-slow-elevation: box-shadow .35s cubic-bezier(0,0,.2,1);
--pd-animation-enter-fast-position-opacity-opacity: opacity .2s cubic-bezier(0,0,.2,1);
--pd-animation-transition-fast-opacity: opacity .3s cubic-bezier(.5,0,.2,1);
--pd-animation-enter-scale-start: scale(0);
--pd-puco-z-index-floating-cta: 1002;
--pd-puco-z-index-comparison-table-cell-label: 2;
--pd-animation-exit-fast-opacity: opacity .18s cubic-bezier(.7,0,1,1);
--pd-elevation-raised-hover: 0 0 4px rgba(0,0,0,.12),0 3px 5px rgb(0 0 0/8%);
--pd-animation-enter-fast-position: .25s cubic-bezier(0,0,.2,1);
--pd-animation-transition-speedcurve: cubic-bezier(.5,0,.2,1);
--pd-puco-transition-curve-6: cubic-bezier(0,0,0.2,1);
--pd-puco-transition-curve-5: cubic-bezier(0.5,0,0.2,1);
--pd-puco-mobile-header-height: 72px;
--pd-puco-z-index-cta-banner: 550;
--pd-animation-enter-fast-elevation: box-shadow .25s cubic-bezier(0,0,.2,1);
--pd-animation-enter-fast-scale: transform .25s cubic-bezier(0,0,.2,1);
--pd-animation-transition-fast-time: .3s;
--pd-animation-enter-scale-end: scale(1);
--pd-animation-exit-fast-time: .18s;
--pd-animation-transition-microinteraction-fast-time: .14s;
--pd-animation-enter-slow-scale: transform .35s cubic-bezier(0,0,.2,1);
--pd-animation-enter-fast-scale-opacity: opacity .2s cubic-bezier(0,0,.2,1),transform .25s cubic-bezier(0,0,.2,1);
--pd-puco-transition-curve-4: cubic-bezier(0.7,0,1,1);
--pd-puco-z-index-header: 500;
--pd-animation-transition-fast-position-scale-scale: transform .25s cubic-bezier(.5,0,.2,1);
--pd-puco-transition-100-time: 0.1s;
--pd-puco-animation-180-time: 0.18s;
--pd-puco-z-index-horizontal-nav-scrolling: 1001;
--pd-puco-transition-500-time: 0.5s;
--pd-puco-header-height: 88px;
--pd-puco-z-index-dropdown-menu: 151;
--pd-puco-z-index-dropdown: 150;
--pd-animation-transition-slow-elevation: box-shadow .4s cubic-bezier(.5,0,.2,1);
--pd-puco-animation-100-time: 0.1s;
--pd-elevation-navbar: 0 0 0 transparent;
--pd-animation-transition-fast-position: .3s cubic-bezier(.5,0,.2,1);
--pd-animation-transition-fast-elevation: box-shadow .3s cubic-bezier(.5,0,.2,1);
--pd-animation-exit-opacity-start: 1;
--pd-puco-z-index-sidebar: 600;
--pd-puco-z-index-copy-tooltip: 300;
--pd-elevation-floating: 0 1px 8px rgba(0,0,0,.1),0 3px 3px rgb(0 0 0/6%),0 3px 4px rgb(0 0 0/5%),0 0 2px rgba(0,0,0,.16);
--pd-puco-z-index-skip-link: 3000;
--pd-animation-exit-slow-opacity: opacity .22s cubic-bezier(.7,0,1,1);
--pd-puco-button-height-m: 42px;
--pd-puco-animation-250-time: 0.25s;
--pd-animation-transition-slow-time: .4s;
--pd-animation-exit-scale-start: scale(1);
--pd-puco-transition-180-time: 0.18s;
--pd-animation-enter-opacity-end: 1;
--pd-puco-mobile-horizontal-nav-height: 45px;
--pd-animation-exit-fast-scale-opacity: opacity .14s cubic-bezier(.7,0,1,1),transform .18s cubic-bezier(.7,0,1,1);
--pd-puco-transition-curve-1: cubic-bezier(0.4,0,0,1);
--pd-elevation-overlay: 0 8px 10px rgba(0,0,0,.1),0 6px 30px rgb(0 0 0/6%),0 16px 24px rgb(0 0 0/5%),0 0 2px rgba(0,0,0,.24);
--pd-animation-exit-opacity-end: 0;
--pd-animation-exit-slow-scale-opacity: opacity .17s cubic-bezier(.7,0,1,1),transform .22s cubic-bezier(.7,0,1,1);
--pd-puco-animation-320-time: 0.32s;
--pd-puco-z-index-overlay: -1;
--pd-animation-enter-slow-position-opacity-position: .35s cubic-bezier(0,0,.2,1);
--crm-desktop-sticky-top: calc(88px + 0px + 65px);
--pd-animation-exit-slow-position-opacity-position: .22s cubic-bezier(.7,0,1,1);
--pd-animation-enter-speedcurve: cubic-bezier(0,0,.2,1);
--pd-animation-exit-scale-with-opacity-start: scale(1);
--pd-puco-z-index-modal: 1000;
--pd-elevation-raised: 0 1px 3px rgb(0 0 0/7%),0 1px 2px rgb(0 0 0/6%),0 0 1px rgb(0 0 0/5%);
--pd-puco-animation-350-time: 0.35s;
--pd-puco-animation-500-time: 0.5s;
--pd-puco-button-height-l: 56px;
--pd-puco-elevation-raised-hover: 0px 3px 5px rgba(0,0,0,.08),0px 0px 4px rgba(0,0,0,.12);
--pd-animation-transition-fast-position-scale-position: .3s cubic-bezier(.5,0,.2,1);
--pd-animation-enter-scale-with-opacity-end: scale(1);
--pd-elevation-none: 0 0 0 transparent;
--pd-puco-z-index-comparison-table-heading-close: 4;
--pd-animation-exit-fast-elevation: box-shadow .18s cubic-bezier(.7,0,1,1);
--pd-puco-animation-400-time: 0.4s;
--pd-animation-transition-fast-scale: transform .3s cubic-bezier(.5,0,.2,1);
--pd-animation-exit-slow-position: .22s cubic-bezier(.7,0,1,1);
--pd-puco-z-index-searchbox: 1;
--pd-animation-exit-fast-scale: transform .18s cubic-bezier(.7,0,1,1);
--pd-elevation-button: 0 1px 2px rgb(42 54 71/5%);
--pd-animation-enter-slow-opacity: opacity .35s cubic-bezier(0,0,.2,1);
--pd-animation-transition-slow-opacity: opacity .4s cubic-bezier(.5,0,.2,1);
--pd-animation-transition-slow-position: .4s cubic-bezier(.5,0,.2,1);
--pd-animation-enter-slow-position: .35s cubic-bezier(0,0,.2,1);
--pd-elevation-overlay-high: 0 18px 28px rgba(0,0,0,.16),0 0 1px rgba(0,0,0,.32);
--pd-puco-z-index-comparison-table-sticky-header: 400;
--pd-puco-max-container-width: 1600px;
--pd-animation-enter-slow-time: .35s;
--pd-puco-horizontal-nav-height: 64px;
--pd-puco-z-index-article-scrollbar: 200;
--crm-desktop-sticky-stack-offset: 65px;
--pd-animation-enter-scale-with-opacity-start: scale(.5);
--pd-animation-exit-slow-elevation: box-shadow .22s cubic-bezier(.7,0,1,1);
--pd-puco-animation-200-time: 0.2s;
--pd-animation-transition-fast-position-opacity-opacity: opacity .25s cubic-bezier(.5,0,.2,1);
--pd-puco-z-index-comparison-table-nav: 3;
--pd-animation-enter-fast-position-opacity-position: .25s cubic-bezier(0,0,.2,1);
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
| xs | 320px | min-width |
| 400px | 400px | min-width |
| sm | 425px | min-width |
| sm | 426px | min-width |
| sm | 500px | max-width |
| sm | 530px | max-width |
| 550px | 550px | max-width |
| sm | 600px | max-width |
| md | 712px | min-width |
| md | 713px | min-width |
| md | 768px | min-width |
| md | 769px | min-width |
| 890px | 890px | min-width |
| 896px | 896px | max-width |
| 897px | 897px | min-width |
| lg | 1023px | max-width |
| lg | 1024px | min-width |
| 1103px | 1103px | max-width |
| 1104px | 1104px | min-width |
| xl | 1220px | max-width |
| xl | 1280px | min-width |
| 1368px | 1368px | max-width |
| 1400px | 1400px | min-width |
| 2xl | 1480px | min-width |
| 2xl | 1600px | min-width |
| 2000px | 2000px | min-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`

**Durations:** `0.4s`, `0.5s`, `0.32s`, `0.1s`, `0.2s`, `0.18s`, `0.25s`

### Common Transitions

```css
transition: all;
transition: transform 0.4s ease-in-out 0.4s, box-shadow 0.4s ease-in-out 0.4s;
transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out, box-shadow 0.32s ease-in-out, padding 0.1s;
transition: background-color 0.2s;
transition: transform 0.2s;
transition: transform 0.32s ease-in-out;
transition: 0.32s;
transition: opacity 0.2s ease-in-out;
transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
transition: background-color 0.18s ease-in-out;
```

### Keyframe Animations

**onetrust-fade-in**
```css
@keyframes onetrust-fade-in {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (26 instances)

```css
.button {
  background-color: rgb(104, 97, 242);
  color: rgb(25, 36, 53);
  font-size: 16px;
  font-weight: 700;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 2px;
}
```

### Cards (3 instances)

```css
.card {
  background-color: rgb(255, 255, 255);
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 3px 5px 0px, rgba(0, 0, 0, 0.12) 0px 0px 4px 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Inputs (7 instances)

```css
.input {
  background-color: rgb(244, 245, 246);
  color: rgb(0, 0, 0);
  border-color: rgb(0, 0, 0);
  border-radius: 0px;
  font-size: 13.3333px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Links (86 instances)

```css
.link {
  color: rgb(0, 0, 238);
  font-size: 16px;
  font-weight: 600;
}
```

### Navigation (80 instances)

```css
.navigatio {
  background-color: rgb(255, 255, 255);
  color: rgb(25, 36, 53);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
}
```

### Footer (52 instances)

```css
.foote {
  background-color: rgb(255, 255, 255);
  color: rgb(25, 36, 53);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 14px;
}
```

### Modals (3 instances)

```css
.modal {
  border-radius: 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Dropdowns (14 instances)

```css
.dropdown {
  border-radius: 0px;
  border-color: rgb(25, 36, 53);
  padding-top: 0px;
}
```

### Accordions (4 instances)

```css
.accordion {
  color: rgb(0, 0, 0);
  font-size: 16px;
  padding-top: 0px;
  padding-right: 0px;
  border-color: rgb(0, 0, 0) rgb(216, 216, 216) rgb(216, 216, 216);
}
```

### Switches (3 instances)

```css
.switche {
  background-color: rgb(70, 130, 84);
  border-radius: 0px;
  border-color: rgb(0, 0, 0);
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 4 instances, 1 variant

**Variant 1** (4 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(25, 36, 53);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(25, 36, 53);
  font-size: 16px;
  font-weight: 600;
```

### Input — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgb(244, 245, 246);
  color: rgb(25, 36, 53);
  padding: 0px 0px 0px 44px;
  border-radius: 100px;
  border: 0px none rgb(25, 36, 53);
  font-size: 14px;
  font-weight: 400;
```

### Button — 2 instances, 2 variants

**Variant 1** (1 instance)

```css
  background: rgb(227, 250, 225);
  color: rgb(14, 82, 53);
  padding: 10px 10px 10px 10px;
  border-radius: 4px;
  border: 0px none rgb(14, 82, 53);
  font-size: 16px;
  font-weight: 700;
```

**Variant 2** (1 instance)

```css
  background: rgb(104, 97, 242);
  color: rgb(255, 255, 255);
  padding: 9px 20px 9px 20px;
  border-radius: 4px;
  border: 0px none rgb(255, 255, 255);
  font-size: 18px;
  font-weight: 700;
```

### Button — 4 instances, 1 variant

**Variant 1** (4 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(25, 36, 53);
  padding: 10px 10px 10px 44px;
  border-radius: 0px;
  border: 0px none rgb(25, 36, 53);
  font-size: 16px;
  font-weight: 400;
```

### Button — 3 instances, 2 variants

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(25, 36, 53);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(25, 36, 53);
  font-size: 14px;
  font-weight: 400;
```

**Variant 2** (1 instance)

```css
  background: rgb(104, 97, 242);
  color: rgb(255, 255, 255);
  padding: 12px 10px 12px 10px;
  border-radius: 2px;
  border: 0px none rgb(255, 255, 255);
  font-size: 16px;
  font-weight: 600;
```

## Layout System

**2 grid containers** and **64 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 1600px | 20px |
| 760px | 0px |
| 100% | 0px |
| calc(50% - 32px) | 0px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 2-column | 1x |
| 4-column | 1x |

### Grid Templates

```css
grid-template-columns: 190px 570px;
grid-template-columns: 281px 281px 281px 281px;
gap: 20px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/wrap | 7x |
| row/nowrap | 40x |
| column/nowrap | 8x |
| column/wrap | 9x |

**Gap values:** `20px`, `4px`, `5px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 6 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#ffffff` | `#6861f2` | 4.58:1 | AA |
| `#0d6ece` | `#ffffff` | 5.07:1 | AA |

## Design System Score

**Overall: 88/100 (Grade: B)**

| Category | Score |
|----------|-------|
| Color Discipline | 92/100 |
| Typography Consistency | 90/100 |
| Spacing System | 85/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 90/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Consistent typography system, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 21 !important rules — prefer specificity over overrides
- 71% of CSS is unused — consider purging
- 3262 duplicate CSS declarations

## Z-Index Map

**8 unique z-index values** across 3 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 1003,2147483647 | div.p.u.c.o.-.s.e.a.r.c.h.b.o.x.-.r.e.s.u.l.t.s._._.w.r.a.p.p.e.r, div.o.t.F.l.a.t. .b.o.t.t.o.m. .o.t.-.w.o.-.t.i.t.l.e. .v.e.r.t.i.c.a.l.-.a.l.i.g.n.-.c.o.n.t.e.n.t, div.o.n.e.t.r.u.s.t.-.p.c.-.d.a.r.k.-.f.i.l.t.e.r. .o.t.-.h.i.d.e. .o.t.-.f.a.d.e.-.i.n |
| dropdown | 551,600 | header.p.u.c.o.-.h.e.a.d.e.r. .p.u.c.o.-.h.e.a.d.e.r.-.-.s.t.i.c.k.y, div.p.u.c.o.-.s.i.d.e.b.a.r |
| base | 1,3 | button.o.t.-.c.l.o.s.e.-.i.c.o.n, button, div.o.t.-.a.c.c.-.g.r.p.c.n.t.r. .o.t.-.a.c.c.-.t.x.t |

**Issues:**
- [object Object]

## SVG Icons

**14 unique SVG icons** detected. Dominant style: **filled**.

| Size Class | Count |
|------------|-------|
| sm | 2 |
| md | 9 |
| lg | 2 |
| xl | 1 |

**Icon colors:** `#FFFFFF`, `#192435`, `#017737`, `#656E7A`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| Inter | self-hosted | 400, 600, 700 | normal |
| Haffer | self-hosted | 700 | normal |

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| general | 1 | objectFit: fill, borderRadius: 0px, shape: square |

**Aspect ratios:** 16:9 (1x)

## Motion Language

**Feel:** mixed · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `xs` | `100ms` | 100 |
| `sm` | `180ms` | 180 |
| `md` | `320ms` | 320 |
| `lg` | `500ms` | 500 |

### Easing Families

- **ease-in-out** (10 uses) — `ease`
- **custom** (22 uses) — `cubic-bezier(0.4, 0, 0.2, 1)`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `onetrust-fade-in` | fade | opacity | 2 |

## Component Anatomy

### button — 13 instances

**Slots:** label, icon
**Variants:** primary · link

| variant | count | sample label |
|---|---|---|
| default | 11 | Features |
| primary | 1 | Try it free |
| link | 1 | Cookies Settings |

## Brand Voice

**Tone:** friendly · **Pronoun:** you-only · **Headings:** Sentence case (tight)

### Top CTA Verbs

- **features** (1)
- **why** (1)
- **resources** (1)
- **all** (1)
- **marketplace** (1)
- **blog** (1)
- **knowledge** (1)
- **academy** (1)

### Button Copy Patterns

- "features" (1×)
- "why pipedrive" (1×)
- "resources" (1×)
- "all categories" (1×)
- "marketplace apps" (1×)
- "blog" (1×)
- "knowledge base" (1×)
- "academy" (1×)
- "try it free" (1×)
- "cookies settings" (1×)

### Sample Headings

> The page you are looking for doesn't exist.
> More resources
>  Manage Consent Preferences
> Cookie List

## Page Intent

**Type:** `legal` (confidence 0.26)

Alternates: blog-post (0.35)

## Section Roles

Reading order (top→bottom): feature-grid → nav → content → content → content → content → content → pricing → footer

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | feature-grid | — | 0.8 |
| 1 | nav | — | 0.9 |
| 2 | content | The page you are looking for doesn't exist. | 0.3 |
| 3 | pricing | More resources | 0.4 |
| 4 | footer | — | 0.95 |
| 5 | content |  Manage Consent Preferences | 0.3 |
| 6 | content | Cookie List | 0.3 |
| 7 | content | — | 0.3 |
| 8 | content | — | 0.3 |

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.414 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 100px |
| backdrop-filter in use | no |
| Gradients | 0 |

## Imagery Style

**Label:** `flat-illustration` (confidence 0.55)
**Counts:** total 1, svg 1, icon 0, screenshot-like 0, photo-like 0
**Dominant aspect:** landscape
**Radius profile on images:** square

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `Inter` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
