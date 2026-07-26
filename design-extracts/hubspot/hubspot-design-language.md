# Design Language: Streamline Your Entire Business With a Free CRM | HubSpot

> Extracted from `https://www.hubspot.com/products/crm` on July 26, 2026
> 2948 elements analyzed

This document describes the complete design language of the website. It is structured for AI/LLM consumption — use it to faithfully recreate the visual design in any framework.

## Color Palette

### Primary Colors

| Role | Hex | RGB | HSL | Usage Count |
|------|-----|-----|-----|-------------|
| Primary | `#f8f5ee` | rgb(248, 245, 238) | hsl(42, 42%, 95%) | 829 |
| Secondary | `#ff4800` | rgb(255, 72, 0) | hsl(17, 100%, 50%) | 13 |
| Accent | `#042729` | rgb(4, 39, 41) | hsl(183, 82%, 9%) | 2 |

### Neutral Colors

| Hex | HSL | Usage Count |
|-----|-----|-------------|
| `#1f1f1f` | hsl(0, 0%, 12%) | 4942 |
| `#000000` | hsl(0, 0%, 0%) | 164 |
| `#f0f0f0` | hsl(0, 0%, 94%) | 2 |

### Background Colors

Used on large-area elements: `#fcfcfa`, `#1f1f1f`, `#ffffff`, `#f8f5ee`, `#042729`, `#000000`

### Text Colors

Text color palette: `#1f1f1f`, `#15295a`, `#ffffff`, `#000000`, `#124548`, `#ff4800`, `#f8f5ee`

### Gradients

```css
background-image: linear-gradient(rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.46));
```

### Full Color Inventory

| Hex | Contexts | Count |
|-----|----------|-------|
| `#1f1f1f` | text, border, background | 4942 |
| `#f8f5ee` | background, text, border | 829 |
| `#000000` | text, border, background | 164 |
| `#124548` | text, border | 22 |
| `#15295a` | text, border | 18 |
| `#ff4800` | background, text, border | 13 |
| `#0000c5` | background | 2 |
| `#f0f0f0` | background | 2 |
| `#042729` | background | 2 |

## Typography

### Font Families

- **HubSpot Sans** — used for all (2791 elements)
- **Times New Roman** — used for body (144 elements)
- **HubSpot Serif** — used for headings (9 elements)
- **Zen Kaku Gothic New** — used for body (4 elements)

### Type Scale

| Size (px) | Size (rem) | Weight | Line Height | Letter Spacing | Used On |
|-----------|------------|--------|-------------|----------------|---------|
| 48px | 3rem | 300 | 55.3846px | normal | h1 |
| 40px | 2.5rem | 300 | 44px | normal | h2 |
| 32px | 2rem | 400 | 56px | normal | div, button, span |
| 24px | 1.5rem | 500 | 34px | normal | h3, h2 |
| 22px | 1.375rem | 500 | 32px | normal | p, h2 |
| 18px | 1.125rem | 500 | 28px | normal | h2, blockquote, p, div |
| 16px | 1rem | 400 | 18.4px | normal | html, head, meta, title |
| 14px | 0.875rem | 400 | 24.5px | normal | div, button, svg, path |
| 12.8px | 0.8rem | 300 | 19.2px | normal | div, p, a |
| 12px | 0.75rem | 500 | 20px | normal | span, svg, use, a |

### Heading Scale

```css
h1 { font-size: 48px; font-weight: 300; line-height: 55.3846px; }
h2 { font-size: 40px; font-weight: 300; line-height: 44px; }
h3 { font-size: 24px; font-weight: 500; line-height: 34px; }
h2 { font-size: 22px; font-weight: 500; line-height: 32px; }
h2 { font-size: 18px; font-weight: 500; line-height: 28px; }
h3 { font-size: 16px; font-weight: 400; line-height: 18.4px; }
h2 { font-size: 12px; font-weight: 500; line-height: 20px; }
```

### Body Text

```css
body { font-size: 16px; font-weight: 400; line-height: 18.4px; }
```

### Font Weights in Use

`300` (2198x), `500` (496x), `400` (254x)

## Spacing

**Base unit:** 4px

| Token | Value | Rem |
|-------|-------|-----|
| spacing-1 | 1px | 0.0625rem |
| spacing-20 | 20px | 1.25rem |
| spacing-24 | 24px | 1.5rem |
| spacing-40 | 40px | 2.5rem |
| spacing-48 | 48px | 3rem |
| spacing-52 | 52px | 3.25rem |
| spacing-56 | 56px | 3.5rem |
| spacing-64 | 64px | 4rem |
| spacing-68 | 68px | 4.25rem |
| spacing-80 | 80px | 5rem |
| spacing-96 | 96px | 6rem |
| spacing-100 | 100px | 6.25rem |
| spacing-165 | 165px | 10.3125rem |

## Border Radii

| Label | Value | Count |
|-------|-------|-------|
| sm | 3px | 3 |
| md | 6px | 2 |
| lg | 16px | 61 |
| full | 42px | 1 |
| full | 50px | 26 |

## Box Shadows

**sm** — blur: 0px
```css
box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 1px;
```

**sm** — blur: 4px
```css
box-shadow: rgba(33, 51, 67, 0.12) 0px 2px 4px 0px;
```

**lg** — blur: 24px
```css
box-shadow: rgba(33, 51, 67, 0.12) 0px 1px 24px 0px;
```

**xl** — blur: 28px
```css
box-shadow: rgba(0, 0, 0, 0.28) 0px 8px 28px 0px;
```

## CSS Custom Properties

### Colors

```css
--cl-card-border-width: 0px;
--cl-card-border-color: transparent;
--wf-integrations-tools-container-color: var(--cl-color-text-01);
--wf-integrations-tools-container-background-color: var(--cl-color-background-01);
--wf-integrations-tools-container-border: var(--cl-border-width-medium) solid var(--cl-color-border-03);
--color-font-primary: var(--black);
--color-font-light: var(--white);
--consent-background-color: var(--black);
--color-modal-heading: var(--black);
--color-high-contrast: #1d0cff;
--color-background-solid-light: var(--white);
--colors-teal-light: var(--black);
--color-brand01: #FF4800;
--color-slide-off: #ddd;
--color-border-light: #0000001c;
--color-banner-border-light: #dbe4ed30;
--color-background-modal: #FCFCFA;
--border-radius-sm: 0.188rem;
--border-radius-md: 0.5rem;
--border-radius-lg: 1rem;
--dark-theme-background-accent-01: #042729;
--cl-color-social-button-fill-hover: rgba(0, 0, 0, 0.6196078431);
--cl-color-container-01: #ffffff;
--cl-color-button-primary-fill-idle: #ff4800;
--cl-color-warning-01: #eeb117;
--cl-color-border-highlight-01: #2f7579;
--cl-color-accent-decoration-01: #9b9897;
--cl-color-play-button-fill-pressed: #ffa766;
--cl-color-overlay-01: rgba(0, 0, 0, 0.8117647059);
--light-theme-icon-on-color-01: #ffffff;
--dark-theme-loading-primary-fill-inactive: #fcc6b1;
--light-theme-loading-primary-fill-inactive: #fcc6b1;
--light-theme-button-secondary-fill-idle: #ffffff;
--dark-theme-accent-fill-08: #800051;
--cl-color-social-button-fill-pressed: rgba(0, 0, 0, 0.6196078431);
--dark-theme-border-highlight-01: #b9cdbe;
--cl-color-icon-01: #1f1f1f;
--cl-color-play-button-fill-idle: #ff4800;
--dark-theme-accent-decoration-06: #6431da;
--cl-color-text-placeholder-01: rgba(0, 0, 0, 0.4);
--cl-color-loading-secondary-fill-active: rgba(0, 0, 0, 0.2);
--dark-theme-accent-decoration-08: #a5016a;
--light-theme-background-accent-02: #d6c2d9;
--dark-theme-button-primary-text-color: #ffffff;
--cl-color-hover-link-02: rgba(0, 0, 0, 0.6196078431);
--cl-color-accent-fill-03: #fcc5be;
--light-theme-accent-fill-07: #b2e9eb;
--cl-color-background-01: #fcfcfa;
--cl-color-button-tertiary-fill-pressed: rgba(0, 0, 0, 0.4705882353);
--cl-color-hover-brand-01: #c93700;
--dark-theme-accent-fill-06: #5113ba;
--light-theme-accent-fill-06: #d7cdfc;
--cl-color-icon-02: #292929;
--light-theme-button-secondary-fill-hover: #fcece6;
--cl-color-border-02: rgba(0, 0, 0, 0.4705882353);
--cl-anchor-pressed-color: #1f1f1f;
--cl-color-text-on-color-01: #ffffff;
--light-theme-accent-fill-05: #ece6d9;
--dark-theme-accent-decoration-02: #c93700;
--dark-theme-loading-secondary-fill-active: #f8f5ee;
--cl-color-background-02: #f8f5ee;
--dark-theme-loading-secondary-fill-inactive: rgba(255, 255, 255, 0.4);
--dark-theme-button-secondary-fill-hover: rgba(0, 0, 0, 0.2);
--cl-color-accent-fill-02: #fcc6b1;
--light-theme-loading-secondary-fill-inactive: rgba(0, 0, 0, 0.1098039216);
--light-theme-accent-fill-03: #fcc5be;
--light-theme-border-02: rgba(0, 0, 0, 0.4705882353);
--cl-color-accent-fill-07: #b2e9eb;
--cl-color-background-footer-01: #1f1f1f;
--cl-anchor-color: #1f1f1f;
--cl-color-checkmark-list-icon-brand-fill: #ff4800;
--cl-color-loading-primary-fill-active: #ff4800;
--cl-color-text-brand-01: #ff4800;
--cl-text-color: #1f1f1f;
--cl-color-success-background-01: #bde7cb;
--cl-color-hover-03: #cfcccb;
--light-theme-button-primary-text-color: #ffffff;
--cl-color-disabled-01: rgba(0, 0, 0, 0.2);
--light-theme-social-button-icon-color: #ffffff;
--dark-theme-background-accent-03: #25155e;
--light-theme-text-on-color-01: #ffffff;
--cl-color-loading-secondary-fill-inactive: rgba(0, 0, 0, 0.1098039216);
--cl-color-button-tertiary-text-color: #ffffff;
--light-theme-accent-decoration-04: #9cbaa4;
--dark-theme-loading-primary-fill-active: #ff4800;
--cl-color-pressed-02: rgba(0, 0, 0, 0.0784313725);
--cl-color-neutral-background-01: #cfcccb;
--light-theme-button-secondary-text-color-pressed: #9f2800;
--cl-color-disabled-03: rgba(0, 0, 0, 0.0509803922);
--cl-border-radius-input: 4px;
--dark-theme-accent-decoration-05: #7d7050;
--light-theme-button-secondary-border: #ff4800;
--light-theme-accent-decoration-08: #fcc3dc;
--light-theme-button-tertiary-text-color: #ffffff;
--cl-color-free-01: #2f7579;
--cl-color-number-fill-active: #ff4800;
--cl-color-accent-fill-01: #cfcccb;
--light-theme-accent-fill-02: #fcc6b1;
--cl-anchor-hover-color-dark: #f8f5ee;
--cl-color-error-background-01: #fcc5be;
--cl-color-pressed-03: #9b9897;
--cl-color-neutral-01: #9b9897;
--dark-theme-button-secondary-border: #f8f5ee;
--cl-color-text-02: rgba(0, 0, 0, 0.6196078431);
--light-theme-accent-decoration-03: #ffa499;
--cl-color-accent-decoration-06: #c4b4f7;
--light-theme-accent-decoration-02: #ffa581;
--cl-color-divider-01: rgba(0, 0, 0, 0.1098039216);
--cl-color-button-secondary-fill-pressed: #fcc6b1;
--dark-theme-accent-fill-02: #9f2800;
--dark-theme-button-tertiary-text-color: #1f1f1f;
--cl-anchor-color-dark: #f8f5ee;
--dark-theme-button-primary-fill-idle: #ff4800;
--dark-theme-button-secondary-fill-pressed: rgba(0, 0, 0, 0.4);
--cl-color-text-link-underline-01: #ff4800;
--light-theme-accent-decoration-07: #97dadc;
--cl-color-button-primary-text-color: #ffffff;
--light-theme-accent-fill-08: #fbdbe9;
--cl-color-social-button-fill-idle: #292929;
--cl-color-link-01: #1f1f1f;
--cl-color-link-02: #124548;
--cl-color-accent-decoration-07: #97dadc;
--dark-theme-border-03: rgba(255, 255, 255, 0.0784313725);
--cl-color-border-brand-01: #ff4800;
--cl-color-disabled-02: rgba(0, 0, 0, 0.0196078431);
--dark-theme-border-brand-01: #ff4800;
--dark-theme-button-secondary-text-color-hover: #f8f5ee;
--cl-color-accent-fill-05: #ece6d9;
--cl-color-button-tertiary-fill-hover: rgba(0, 0, 0, 0.6196078431);
--dark-theme-button-primary-fill-hover: #c93700;
--cl-color-border-01: #1f1f1f;
--cl-color-button-secondary-text-color-pressed: #9f2800;
--light-theme-button-primary-fill-idle: #ff4800;
--cl-color-play-button-fill-hover: #c93700;
--cl-color-loading-primary-fill-inactive: #fcc6b1;
--dark-theme-icon-on-color-01: #1f1f1f;
--light-theme-accent-fill-04: #b9cdbe;
--light-theme-button-primary-fill-hover: #c93700;
--cl-color-accent-decoration-05: #ccc0a3;
--cl-color-number-fill-statistic: #ff4800;
--cl-color-hover-inverse-01: rgba(0, 0, 0, 0.8117647059);
--dark-theme-accent-fill-05: #64593e;
--cl-color-button-primary-fill-hover: #c93700;
--dark-theme-accent-decoration-01: #1c1c1c;
--dark-theme-border-01: #f8f5ee;
--cl-color-pressed-brand-01: #9f2800;
--cl-color-pressed-link-02: rgba(0, 0, 0, 0.6196078431);
--light-theme-border-01: #1f1f1f;
--cl-color-hover-02: rgba(0, 0, 0, 0.0588235294);
--light-theme-button-secondary-fill-pressed: #fcc6b1;
--cl-border-radius-round: 9999px;
--cl-border-radius-container: 16px;
--cl-color-accent-decoration-02: #ffa581;
--light-theme-button-primary-fill-pressed: #9f2800;
--cl-anchor-hover-color: #1f1f1f;
--light-theme-accent-decoration-06: #c4b4f7;
--dark-theme-accent-decoration-03: #d9002b;
--dark-theme-border-02: rgba(255, 255, 255, 0.4);
--light-theme-border-03: rgba(0, 0, 0, 0.1098039216);
--dark-theme-accent-fill-03: #ac0020;
--cl-color-container-inverse-01: #1f1f1f;
--cl-color-success-01: #00823a;
--cl-color-accent-fill-08: #fbdbe9;
--dark-theme-button-secondary-fill-idle: rgba(0, 0, 0, 0.1098039216);
--dark-theme-button-primary-fill-pressed: #9f2800;
--cl-color-hover-link-01: #1f1f1f;
--cl-color-hover-01: rgba(0, 0, 0, 0.0509803922);
--light-theme-loading-primary-fill-active: #ff4800;
--light-theme-border-highlight-01: #2f7579;
--cl-color-accent-decoration-08: #fcc3dc;
--cl-color-pressed-link-01: #1f1f1f;
--cl-color-social-button-icon-color: #ffffff;
--light-theme-button-secondary-text-color-hover: #c93700;
--cl-color-badge-brand-fill-01: #fcc6b1;
--cl-color-button-secondary-fill-idle: #ffffff;
--light-theme-accent-fill-01: #cfcccb;
--light-theme-background-accent-03: #fcc3dc;
--dark-theme-button-secondary-text-color-pressed: #f8f5ee;
--light-theme-accent-decoration-05: #ccc0a3;
--cl-color-pressed-inverse-01: rgba(0, 0, 0, 0.6196078431);
--cl-border-radius-container-medium: 16px;
--cl-border-radius-container-small: 8px;
--cl-color-background-accent-03: #fcc3dc;
--light-theme-accent-decoration-01: #9b9897;
--dark-theme-accent-decoration-04: #327142;
--light-theme-background-accent-01: #b9cdbe;
--cl-color-beta-01: #7d53e9;
--cl-color-button-secondary-text-color-hover: #c93700;
--cl-color-free-background-01: #ccf4f5;
--cl-color-accent-decoration-04: #9cbaa4;
--cl-color-button-primary-fill-pressed: #9f2800;
--cl-color-warning-background-01: #fbeece;
--light-theme-loading-secondary-fill-active: rgba(0, 0, 0, 0.2);
--dark-theme-accent-fill-07: #1e5b5f;
--cl-color-background-accent-02: #d6c2d9;
--cl-color-pressed-01: rgba(0, 0, 0, 0.0588235294);
--cl-color-number-fill-inactive: #ffdbc1;
--cl-color-accent-fill-04: #b9cdbe;
--cl-border-width-heavy: 2px;
--cl-border-width-medium: 1px;
--cl-color-hubspot-brand-01: #ff4800;
--cl-color-button-secondary-border: #ff4800;
--cl-color-button-secondary-fill-hover: #fcece6;
--cl-color-background-accent-01: #b9cdbe;
--cl-color-beta-background-01: #e5e1fa;
--cl-border-radius-medium: 8px;
--cl-color-border-03: rgba(0, 0, 0, 0.1098039216);
--cl-border-radius-small: 4px;
--cl-color-background-03: #f8f5ee;
--cl-color-focus-01: #2f7579;
--cl-color-error-01: #d9002b;
--cl-color-icon-on-color-01: #ffffff;
--cl-color-accent-decoration-03: #ffa499;
--cl-color-accent-fill-06: #d7cdfc;
--dark-theme-background-accent-02: #46062b;
--cl-color-button-tertiary-fill-idle: #1f1f1f;
--cl-color-container-03: rgba(255, 255, 255, 0.4);
--cl-color-text-01: #1f1f1f;
--dark-theme-text-on-color-01: #1f1f1f;
--dark-theme-social-button-icon-color: #1f1f1f;
--dark-theme-accent-fill-01: #000000;
--light-theme-border-brand-01: #ff4800;
--dark-theme-accent-decoration-07: #2f7579;
--dark-theme-accent-fill-04: #1b582a;
--cl-color-container-02: rgba(255, 255, 255, 0.4588235294);
```

### Spacing

```css
--cl-section-padding-none: 0;
--cl-section-padding-extra-small: 16px;
--cl-section-padding-small: 24px;
--cl-section-padding-medium: 40px;
--cl-section-padding-large: 64px;
--csol-content-padding-true: 1rem;
--csol-content-padding-false: 0;
--csol-content-padding-mobile: var(--csol-content-padding-true);
--csol-content-padding-desktop: var(--csol-content-padding-false);
--csol-content-padding-desktop-enhanced-layout: var(--csol-content-padding-false);
--csol-section-padding-top: 16px;
--csol-section-padding-top-desktop: 24px;
--csol-section-padding-bottom: 16px;
--csol-section-padding-bottom-desktop: 24px;
--wf-section-padding-none: 0px;
--wf-section-padding-xs-mobile: 16px;
--wf-section-padding-xs: 24px;
--wf-section-padding-s-mobile: 24px;
--wf-section-padding-s: 40px;
--wf-section-padding-md-mobile: 40px;
--wf-section-padding-md: 64px;
--wf-section-padding-lg-mobile: 64px;
--wf-section-padding-lg: 96px;
--cl-carousel-slide-gap-default: 24px;
--cl-carousel-dot-size: 16px;
--cl-carousel-dot-gap: 8px;
--wf-integrations-row-gap: 40px;
--wf-integrations-tools-container-gap: 4rem;
--wf-integrations-tools-grid-wrapper-gap: 16px;
--wf-integrations-tools-grid-wrapper-gap-xsmall: 1rem;
--wf-integrations-tools-grid-wrapper-gap-small: 48px;
--wf-integrations-tools-title-link-wrapper-gap: 24;
--font-size: 0.975rem;
--font-size-mobile: 0.8rem;
--font-size-mobile-small: 0.7rem;
--font-size-small: 0.875rem;
--font-size-medium: 0.9rem;
--font-size-large: 1.125rem;
--font-size-xl: 1.375rem;
--font-size-banner-icon: 0.9998rem;
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
--spacing-2xl: 2.5rem;
--toggle-nob-size: 1.39rem;
--close-button-size: 1.25rem;
--cl-letter-spacing-display-01-small: normal;
--cl-font-size-micro: 0.75rem;
--cl-font-size-medium: 1rem;
--cl-font-size-display-01: 7rem;
--cl-font-size-microcopy: 0.75rem;
--cl-font-size-h5: 1.125rem;
--cl-font-size-display-02-small: 3.5rem;
--cl-font-size-p-large: 1.125rem;
--cl-font-size-p-medium: 1rem;
--cl-font-size-large: 1.125rem;
--cl-font-size-display-02: 4.5rem;
--cl-letter-spacing-display-01: -0.1875rem;
--cl-font-size-display-01-small: 3.5rem;
--cl-font-size-h3: 1.5rem;
--cl-text-margin-large: 1.5rem;
--cl-text-margin-medium: 1rem;
--cl-font-size-display-03-small: 1.5rem;
--cl-font-size-h6: 1rem;
--cl-text-font-size: 1rem;
--cl-font-size-small: 0.875rem;
--cl-font-size-p-small: 0.875rem;
--cl-font-size-h1-small: 2.5rem;
--cl-font-size-microheading: 0.875rem;
--cl-font-size-blockquote: 1.125rem;
--cl-text-margin-small: 0.5rem;
--cl-font-size-h4: 1.375rem;
--cl-font-size-h2-small: 2rem;
--cl-letter-spacing-display-02-small: normal;
--cl-font-size-h1: 3rem;
--cl-font-size-h2: 2.5rem;
--cl-text-letter-spacing: normal;
--cl-font-size-input-label: 0.875rem;
--cl-font-size-display-03: 1.5rem;
--cl-letter-spacing-display-02: normal;
```

### Typography

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semi-bold: 600;
--font-weight-bold: 700;
--font-hs-hubspot-sans-medium: 'HubSpot Sans';
--font-lexend-deca: 'Lexend Deca';
--font-lexend-deca-alt: 'LexendDeca';
--font-family: var(--font-hs-hubspot-sans-medium), var(--font-lexend-deca), var(--font-lexend-deca-alt), 'Helvetica Neue', helvetica, arial, sans-serif;
--cl-line-height-large: 1.77777778;
--cl-line-height-display-02-small: 1.14285714;
--dark-theme-text-placeholder-01: rgba(255, 255, 255, 0.4);
--cl-font-weight-h5: 500;
--cl-text-line-height: 1.75;
--cl-font-weight-microcopy: 500;
--cl-line-height-h4: 1.45454545;
--cl-line-height-h2-small: 1.125;
--cl-line-height-h6: 1.75;
--dark-theme-text-brand-01: #f8f5ee;
--cl-line-height-display-03: 1.41666667;
--dark-theme-text-02: rgba(255, 255, 255, 0.6196078431);
--cl-font-weight-p-large: 300;
--cl-font-weight-input-label: 500;
--cl-font-weight-display-02-small: 300;
--cl-font-family-display: 'HubSpot Serif', serif;
--cl-line-height-microheading: 1.57142857;
--cl-line-height-h1-small: 1.04545455;
--cl-font-weight-display-02: 300;
--cl-font-weight-light: 300;
--cl-line-height-p-medium: 1.75;
--cl-line-height-display-01: 1.07142857;
--cl-text-link-underline-thickness: 2px;
--cl-font-weight-p-link: 500;
--cl-anchor-text-decoration: underline;
--cl-line-height-small: 1.57142857;
--dark-theme-text-link-underline-01: #ff4800;
--dark-theme-text-01: #f8f5ee;
--cl-font-family-heading: 'HubSpot Serif', serif;
--cl-font-weight-h1-small: 300;
--light-theme-text-placeholder-01: rgba(0, 0, 0, 0.4);
--cl-font-weight-display-01: 300;
--cl-line-height-p-large: 1.77777778;
--cl-font-weight-h1: 300;
--cl-line-height-h2: 1.1;
--cl-anchor-font-weight: 500;
--cl-font-weight-h3: 500;
--cl-font-weight-display-03-small: 500;
--cl-font-weight-book: 300;
--cl-text-font-weight: 300;
--cl-font-weight-p-medium: 300;
--cl-font-weight-h6: 500;
--cl-line-height-display-02: 1.22222222;
--cl-font-weight-display-01-small: 300;
--cl-line-height-medium: 1.75;
--cl-font-weight-p-small: 300;
--cl-font-weight-medium: 500;
--cl-font-family: 'HubSpot Sans', sans-serif;
--cl-line-height-h1: 1.15384615;
--cl-font-weight-h2: 300;
--cl-font-weight-demi-bold: 500;
--cl-line-height-display-01-small: 1.14285714;
--cl-font-weight-microheading: 500;
--cl-text-link-underline-offset: 6px;
--light-theme-text-link-underline-01: #ff4800;
--cl-line-height-input-label: 1.57142857;
--cl-line-height-display-03-small: 1.41666667;
--cl-font-weight-display-03: 500;
--cl-line-height-p-small: 1.57142857;
--light-theme-text-02: rgba(0, 0, 0, 0.6196078431);
--light-theme-text-01: #1f1f1f;
--cl-line-height-blockquote: 1.78;
--cl-font-weight-h2-small: 300;
--light-theme-text-brand-01: #ff4800;
--cl-line-height-microcopy: 1.66666667;
--cl-line-height-h5: 1.55555556;
--cl-font-weight-h4: 500;
--cl-font-weight-blockquote: 300;
--cl-line-height-h3: 1.41666667;
```

### Shadows

```css
--shadow-light: 0 0.063rem 0.313rem rgba(240, 246, 251, 0.12);
```

### Other

```css
--cl-content-max-width-default: 1080px;
--cl-content-max-width-lg: 1220px;
--cl-content-max-width-enhanced-layout: 1460px;
--cl-content-max-width: var(--cl-content-max-width-default);
--cl-content-max-width-enhanced: var(--cl-content-max-width-default);
--cl-section-content-max-width: var(--cl-content-max-width);
--cl-section-gutter: 16px;
--global-nav-content-max-width: 1080px;
--global-nav-header-height: 56px;
--global-nav-header-height-dynamic: 56px;
--global-nav-header-lp-height: 54px;
--cl-carousel-slides-per-view-default: 3;
--cl-carousel-slides-per-view-phone: 1;
--cl-carousel-slides-per-view-tablet: 2;
--cl-carousel-peek-default: 48px;
--cl-carousel-peek-phone: 24px;
--cl-carousel-peek-tablet: 32px;
--cl-carousel-slides-to-scroll-default: 1;
--cl-carousel-slides-to-scroll-phone: 1;
--cl-carousel-slides-to-scroll-tablet: 2;
--cl-carousel-is-infinite: 0;
--cl-carousel-show-dots-default: 1;
--cl-carousel-show-dots-phone: 1;
--cl-carousel-show-dots-tablet: 1;
--cl-carousel-show-dots-desktop: 1;
--cl-carousel-animation-duration: 300ms;
--cl-carousel-easing: ease;
--wf-integrations-row-flex-direction: column;
--wf-integrations-tools-grid-wrapper-column-count: 3;
--wf-integrations-tools-grid-wrapper-column-count-single: 4;
--wf-integrations-tools-grid-wrapper-row-count: 2;
--wf-integrations-tools-grid-item-wrapper-min-width: 70px;
--wf-integrations-tools-grid-item-wrapper-max-width: 100px;
--wf-integrations-tools-grid-item-wrapper-min-height: 70px;
--wf-integrations-tools-grid-item-wrapper-max-height: 100px;
--breakpoint-phone: 500px;
--breakpoint-tablet-portrait: 767px;
--breakpoint-tablet: 1024px;
--breakpoint-desktop: 1366px;
--black: #1F1F1F;
--pantera: #213343;
--white: #FFFFFF;
--light-interactive: #FFFFFF;
--modal-max-height: calc(min(38.375rem, 100%));
--toggle-width: 4rem;
--toggle-height: 2rem;
--button-min-width: 7.188rem;
--button-min-height: 2.5rem;
--z-index-banner: 99999;
--z-index-modal: 3000000002;
--default-content-width: 1080px;
--button-transition: 0.15s color ease-out, 0.15s background-color ease-out, 0.15s border-color ease-out;
--dark-theme-button-tertiary-fill-pressed: rgba(255, 255, 255, 0.6196078431);
--light-theme-pressed-inverse-01: rgba(0, 0, 0, 0.6196078431);
--dark-theme-error-01: #ff7b70;
--light-theme-pressed-link-01: #1f1f1f;
--light-theme-hover-03: #cfcccb;
--dark-theme-focus-01: #7aa485;
--dark-theme-number-fill-statistic: #ff4800;
--dark-theme-icon-02: #b6b1af;
--dark-theme-hover-brand-01: #ff7d4c;
--light-theme-pressed-02: rgba(0, 0, 0, 0.0784313725);
--light-theme-icon-02: #292929;
--light-theme-warning-background-01: #fbeece;
--light-theme-pressed-01: rgba(0, 0, 0, 0.0588235294);
--light-theme-number-fill-inactive: #ffdbc1;
--light-theme-overlay-01: rgba(0, 0, 0, 0.8117647059);
--light-theme-success-01: #00823a;
--light-theme-checkmark-list-icon-brand-fill: #ff4800;
--dark-theme-free-background-01: #2f7579;
--light-theme-neutral-01: #9b9897;
--dark-theme-divider-01: rgba(255, 255, 255, 0.0784313725);
--dark-theme-play-button-fill-pressed: #9f2800;
--light-theme-pressed-03: #9b9897;
--dark-theme-background-footer-01: #1f1f1f;
--dark-theme-neutral-background-01: #141414;
--light-theme-warning-01: #eeb117;
--dark-theme-warning-01: #d39913;
--light-theme-play-button-fill-idle: #ff4800;
--dark-theme-disabled-03: rgba(255, 255, 255, 0.0784313725);
--light-theme-background-03: #f8f5ee;
--light-theme-badge-brand-fill-01: #fcc6b1;
--dark-theme-pressed-link-02: rgba(255, 255, 255, 0.6196078431);
--light-theme-button-tertiary-fill-pressed: rgba(0, 0, 0, 0.4705882353);
--light-theme-link-02: #124548;
--dark-theme-background-03: #093436;
--light-theme-disabled-01: rgba(0, 0, 0, 0.2);
--light-theme-number-fill-active: #ff4800;
--dark-theme-hover-link-02: rgba(255, 255, 255, 0.6196078431);
--light-theme-hover-brand-01: #c93700;
--light-theme-success-background-01: #bde7cb;
--light-theme-button-tertiary-fill-idle: #1f1f1f;
--light-theme-social-button-fill-pressed: rgba(0, 0, 0, 0.6196078431);
--dark-theme-badge-brand-fill-01: #c93700;
--dark-theme-social-button-fill-pressed: rgba(255, 255, 255, 0.6196078431);
--cl-fixed-element-total-height: 0px;
--dark-theme-pressed-brand-01: #ffa581;
--light-theme-hover-link-01: #1f1f1f;
--light-theme-social-button-fill-hover: rgba(0, 0, 0, 0.6196078431);
--dark-theme-container-03: rgba(0, 0, 0, 0.4);
--light-theme-container-02: rgba(255, 255, 255, 0.4588235294);
--light-theme-background-footer-01: #1f1f1f;
--dark-theme-link-01: #f8f5ee;
--dark-theme-icon-01: #f8f5ee;
--light-theme-link-01: #1f1f1f;
--light-theme-beta-background-01: #e5e1fa;
--dark-theme-number-fill-active: #ff4800;
--dark-theme-hover-inverse-01: rgba(255, 255, 255, 0.8117647059);
--dark-theme-disabled-02: rgba(255, 255, 255, 0.0588235294);
--dark-theme-hover-02: rgba(255, 255, 255, 0.0588235294);
--dark-theme-error-background-01: #d9002b;
--light-theme-play-button-fill-hover: #c93700;
--dark-theme-container-inverse-01: #ffffff;
--light-theme-neutral-background-01: #cfcccb;
--light-theme-hover-link-02: rgba(0, 0, 0, 0.6196078431);
--light-theme-hover-01: rgba(0, 0, 0, 0.0509803922);
--dark-theme-free-01: #459195;
--dark-theme-checkmark-list-icon-brand-fill: #ff4800;
--dark-theme-pressed-link-01: #f8f5ee;
--dark-theme-background-01: #042729;
--light-theme-container-inverse-01: #1f1f1f;
--dark-theme-pressed-01: rgba(255, 255, 255, 0.0588235294);
--light-theme-icon-01: #1f1f1f;
--dark-theme-hover-03: rgba(255, 255, 255, 0.0784313725);
--light-theme-pressed-brand-01: #9f2800;
--dark-theme-overlay-01: rgba(0, 0, 0, 0.8117647059);
--light-theme-hover-02: rgba(0, 0, 0, 0.0588235294);
--dark-theme-beta-background-01: #6431da;
--light-theme-play-button-fill-pressed: #ffa766;
--dark-theme-hubspot-brand-01: #ff4800;
--light-theme-pressed-link-02: rgba(0, 0, 0, 0.6196078431);
--dark-theme-social-button-fill-hover: rgba(255, 255, 255, 0.8117647059);
--dark-theme-background-02: #093436;
--light-theme-beta-01: #7d53e9;
--dark-theme-neutral-01: #4d4c4c;
--light-theme-focus-01: #2f7579;
--light-theme-social-button-fill-idle: #292929;
--dark-theme-pressed-03: rgba(255, 255, 255, 0.1098039216);
--dark-theme-pressed-inverse-01: rgba(255, 255, 255, 0.6196078431);
--dark-theme-warning-background-01: #956309;
--light-theme-free-01: #2f7579;
--dark-theme-container-01: #061c1d;
--dark-theme-play-button-fill-hover: #c93700;
--dark-theme-success-background-01: #00823a;
--light-theme-background-01: #fcfcfa;
--dark-theme-link-02: #eef4f0;
--light-theme-free-background-01: #ccf4f5;
--dark-theme-pressed-02: rgba(255, 255, 255, 0.0784313725);
--light-theme-background-02: #f8f5ee;
--light-theme-error-01: #d9002b;
--dark-theme-social-button-fill-idle: #f8f5ee;
--light-theme-hover-inverse-01: rgba(0, 0, 0, 0.8117647059);
--light-theme-hubspot-brand-01: #ff4800;
--light-theme-error-background-01: #fcc5be;
--light-theme-container-01: #ffffff;
--light-theme-button-tertiary-fill-hover: rgba(0, 0, 0, 0.6196078431);
--dark-theme-button-tertiary-fill-idle: #ffffff;
--dark-theme-disabled-01: rgba(255, 255, 255, 0.168627451);
--dark-theme-hover-link-01: #f8f5ee;
--light-theme-number-fill-statistic: #ff4800;
--dark-theme-play-button-fill-idle: #ff4800;
--dark-theme-button-tertiary-fill-hover: rgba(255, 255, 255, 0.8117647059);
--dark-theme-success-01: #3cb769;
--light-theme-disabled-03: rgba(0, 0, 0, 0.0509803922);
--light-theme-container-03: rgba(255, 255, 255, 0.4);
--dark-theme-number-fill-inactive: #ffdbc1;
--dark-theme-beta-01: #9778ec;
--dark-theme-container-02: rgba(0, 0, 0, 0.168627451);
--light-theme-disabled-02: rgba(0, 0, 0, 0.0196078431);
--light-theme-divider-01: rgba(0, 0, 0, 0.1098039216);
--dark-theme-hover-01: rgba(255, 255, 255, 0.0509803922);
```

### Dependencies

```css
--cl-content-max-width: --cl-content-max-width-default;
--cl-content-max-width-enhanced: --cl-content-max-width-default;
--cl-section-content-max-width: --cl-content-max-width;
--csol-content-padding-mobile: --csol-content-padding-true;
--csol-content-padding-desktop: --csol-content-padding-false;
--csol-content-padding-desktop-enhanced-layout: --csol-content-padding-false;
--wf-integrations-tools-container-color: --cl-color-text-01;
--wf-integrations-tools-container-background-color: --cl-color-background-01;
--wf-integrations-tools-container-border: --cl-border-width-medium,--cl-color-border-03;
--color-font-primary: --black;
--color-font-light: --white;
--consent-background-color: --black;
--color-modal-heading: --black;
--color-background-solid-light: --white;
--colors-teal-light: --black;
--font-family: --font-hs-hubspot-sans-medium,--font-lexend-deca,--font-lexend-deca-alt;
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
| sm | 450px | max-width |
| sm | 544px | min-width |
| 568px | 568px | max-width |
| 570px | 570px | max-width |
| 575px | 575px | max-width |
| sm | 600px | max-width |
| sm | 694px | max-width |
| md | 800px | max-width |
| 850px | 850px | max-width |
| lg | 966px | max-width |
| lg | 970px | max-width |
| lg | 1080px | max-width |
| 1152px | 1152px | max-width |

## Transitions & Animations

**Easing functions:** `[object Object]`, `[object Object]`

**Durations:** `0.15s`, `0.3s`, `0.2s`, `0.1s`, `0.5s`, `0.01s`, `0s`, `0.4s`

### Common Transitions

```css
transition: all;
transition: color 0.15s ease-out, background-color 0.15s ease-out, border-color 0.15s ease-out;
transition: background-color 0.15s linear, color 0.15s linear;
transition: transform 0.3s;
transition: opacity 0.2s ease-out 0.1s, visibility 0.3s 0.1s;
transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
transition: 0.3s ease-in;
transition: text-underline-offset 0.3s ease-in-out;
transition: transform 0.3s ease-out;
transition: 0.3s ease-in-out;
```

### Keyframe Animations

**global-nav-slide-right**
```css
@keyframes global-nav-slide-right {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0%); }
}
```

**global-nav-slide-left**
```css
@keyframes global-nav-slide-left {
  0% { transform: translateX(100%); }
  100% { transform: translateX(0%); }
}
```

**spin**
```css
@keyframes spin {
  100% { transform: rotate(1turn); }
}
```

**dash**
```css
@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -50; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -140; }
}
```

**banner_animation**
```css
@keyframes banner_animation {
  0% { transform: translateY(200vh) translateZ(3e+09px); opacity: 0; }
  99% { opacity: 0; }
  100% { transform: translateY(var(--hs-banner-translate-y,0)) translateZ(3000000000px); opacity: 1; }
}
```

**feedback-slide-in-hs-feedback-left**
```css
@keyframes feedback-slide-in-hs-feedback-left {
  0% { transform: translate(0px, 100%); }
  100% { transform: translate(0px, 0px); }
}
```

**feedback-slide-out-hs-feedback-left**
```css
@keyframes feedback-slide-out-hs-feedback-left {
  0% { transform: translate(0px, 0px); }
  100% { transform: translate(0px, 100%); }
}
```

**feedback-slide-in-hs-feedback-right**
```css
@keyframes feedback-slide-in-hs-feedback-right {
  0% { transform: translate(0px, 100%); }
  100% { transform: translate(0px, 0px); }
}
```

**feedback-slide-out-hs-feedback-right**
```css
@keyframes feedback-slide-out-hs-feedback-right {
  0% { transform: translate(0px, 0px); }
  100% { transform: translate(0px, 100%); }
}
```

**feedback-slide-in-hs-feedback-top**
```css
@keyframes feedback-slide-in-hs-feedback-top {
  0% { transform: translate(0px, -100%); }
  100% { transform: translate(0px, 0px); }
}
```

## Component Patterns

Detected UI component patterns and their most common styles:

### Buttons (61 instances)

```css
.button {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  font-size: 16px;
  font-weight: 500;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 0px;
}
```

### Cards (492 instances)

```css
.card {
  background-color: rgb(255, 255, 255);
  border-radius: 0px;
  box-shadow: rgba(33, 51, 67, 0.12) 0px 1px 24px 0px;
  padding-top: 0px;
  padding-right: 0px;
}
```

### Inputs (2 instances)

```css
.input {
  background-color: rgb(255, 255, 255);
  color: rgb(31, 31, 31);
  border-color: rgb(31, 31, 31);
  border-radius: 4px;
  font-size: 16px;
  padding-top: 3.2px;
  padding-right: 8px;
}
```

### Links (246 instances)

```css
.link {
  color: rgb(31, 31, 31);
  font-size: 14px;
  font-weight: 500;
}
```

### Navigation (1030 instances)

```css
.navigatio {
  background-color: rgb(255, 255, 255);
  color: rgb(31, 31, 31);
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  position: static;
  box-shadow: rgba(33, 51, 67, 0.12) 0px 1px 24px 0px;
}
```

### Footer (87 instances)

```css
.foote {
  background-color: rgb(31, 31, 31);
  color: rgb(248, 245, 238);
  padding-top: 0px;
  padding-bottom: 0px;
  font-size: 16px;
}
```

### Modals (4 instances)

```css
.modal {
  background-color: rgb(31, 31, 31);
  border-radius: 0px;
  box-shadow: rgba(0, 0, 0, 0.28) 0px 8px 28px 0px;
  padding-top: 0px;
  padding-right: 0px;
  max-width: 100%;
}
```

### Dropdowns (76 instances)

```css
.dropdown {
  background-color: rgb(255, 255, 255);
  border-radius: 0px;
  box-shadow: rgba(33, 51, 67, 0.12) 0px 1px 24px 0px;
  border-color: rgb(31, 31, 31);
  padding-top: 0px;
}
```

### Badges (3 instances)

```css
.badge {
  background-color: rgba(255, 255, 255, 0.46);
  color: rgb(0, 0, 0);
  font-size: 12px;
  font-weight: 500;
  padding-top: 0px;
  padding-right: 0px;
  border-radius: 0px;
}
```

### Avatars (6 instances)

```css
.avatar {
  border-radius: 50%;
}
```

### Tabs (40 instances)

```css
.tab {
  background-color: rgb(255, 255, 255);
  color: rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
  padding-top: 0px;
  padding-right: 0px;
  border-color: rgb(31, 31, 31);
  border-radius: 0px;
}
```

### Accordions (52 instances)

```css
.accordion {
  background-color: rgb(255, 255, 255);
  color: rgb(31, 31, 31);
  font-size: 16px;
  padding-top: 0px;
  padding-right: 0px;
  border-color: rgb(31, 31, 31);
}
```

### Switches (38 instances)

```css
.switche {
  background-color: rgb(0, 0, 197);
  border-radius: 0px;
  border-color: rgb(31, 31, 31);
}
```

## Component Clusters

Reusable component instances grouped by DOM structure and style similarity:

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(21, 41, 90);
  padding: 6px 2px 2px 2px;
  border-radius: 0px;
  border: 0px none rgb(21, 41, 90);
  font-size: 32px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(255, 255, 255);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(255, 255, 255);
  font-size: 32px;
  font-weight: 400;
```

### Button — 3 instances, 2 variants

**Variant 1** (2 instances)

```css
  background: rgb(255, 255, 255);
  color: rgb(31, 31, 31);
  padding: 8px 16px 8px 16px;
  border-radius: 8px;
  border: 0px none rgb(31, 31, 31);
  font-size: 14px;
  font-weight: 500;
```

**Variant 2** (1 instance)

```css
  background: rgb(255, 72, 0);
  color: rgb(0, 0, 0);
  padding: 1px 6px 1px 6px;
  border-radius: 50%;
  border: 0px none rgb(0, 0, 0);
  font-size: 16px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(255, 255, 255);
  padding: 0px 0px 0px 0px;
  border-radius: 42px;
  border: 0px none rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 500;
```

### Button — 7 instances, 2 variants

**Variant 1** (5 instances)

```css
  background: rgb(31, 31, 31);
  color: rgb(255, 255, 255);
  padding: 8px 16px 8px 16px;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 0, 0);
  font-size: 14px;
  font-weight: 500;
```

**Variant 2** (2 instances)

```css
  background: rgb(255, 255, 255);
  color: rgb(255, 72, 0);
  padding: 12px 24px 12px 24px;
  border-radius: 8px;
  border: 2px solid rgb(255, 72, 0);
  font-size: 16px;
  font-weight: 500;
```

### Button — 9 instances, 2 variants

**Variant 1** (8 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 400;
```

**Variant 2** (1 instance)

```css
  background: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  padding: 0px 0px 0px 0px;
  border-radius: 50%;
  border: 0px none rgb(0, 0, 0);
  font-size: 16px;
  font-weight: 400;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 16px 0px 16px 0px;
  border-radius: 8px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 400;
```

### Input — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 3.2px 8px 3.2px 8px;
  border-radius: 4px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgb(252, 252, 250);
  color: rgb(31, 31, 31);
  padding: 12px 24px 12px 24px;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 0, 0.11);
  font-size: 16px;
  font-weight: 500;
```

### Card — 4 instances, 1 variant

**Variant 1** (4 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 13 instances, 2 variants

**Variant 1** (12 instances)

```css
  background: rgb(255, 255, 255);
  color: rgb(31, 31, 31);
  padding: 12px 12px 12px 12px;
  border-radius: 16px;
  border: 0px solid rgba(0, 0, 0, 0);
  font-size: 16px;
  font-weight: 300;
```

**Variant 2** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(248, 245, 238);
  padding: 40px 0px 40px 0px;
  border-radius: 16px;
  border: 0px solid rgba(0, 0, 0, 0);
  font-size: 16px;
  font-weight: 300;
```

### Card — 11 instances, 1 variant

**Variant 1** (11 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Button — 3 instances, 2 variants

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0.05);
  color: rgb(31, 31, 31);
  padding: 8px 8px 8px 8px;
  border-radius: 16px;
  border: 0px solid rgba(0, 0, 0, 0);
  font-size: 14px;
  font-weight: 500;
```

**Variant 2** (2 instances)

```css
  background: rgb(255, 255, 255);
  color: rgb(31, 31, 31);
  padding: 8px 8px 8px 8px;
  border-radius: 16px;
  border: 0px solid rgba(0, 0, 0, 0);
  font-size: 14px;
  font-weight: 500;
```

### Card — 32 instances, 2 variants

**Variant 1** (14 instances)

```css
  background: rgb(255, 255, 255);
  color: rgb(31, 31, 31);
  padding: 12px 12px 12px 12px;
  border-radius: 16px;
  border: 0px solid rgba(0, 0, 0, 0);
  font-size: 16px;
  font-weight: 300;
```

**Variant 2** (18 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 16px 16px 16px 16px;
  border-radius: 0px;
  border: 0px 0px 1px none none solid rgb(31, 31, 31) rgb(31, 31, 31) rgba(0, 0, 0, 0.11);
  font-size: 16px;
  font-weight: 300;
```

### Card — 14 instances, 1 variant

**Variant 1** (14 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 14 instances, 1 variant

**Variant 1** (14 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 500;
```

### Link — 14 instances, 1 variant

**Variant 1** (14 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 500;
```

### Card — 39 instances, 1 variant

**Variant 1** (39 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 14px;
  font-weight: 300;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Button — 2 instances, 1 variant

**Variant 1** (2 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 3 instances, 1 variant

**Variant 1** (3 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 18 instances, 1 variant

**Variant 1** (18 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Link — 18 instances, 1 variant

**Variant 1** (18 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 500;
```

### Card — 22 instances, 1 variant

**Variant 1** (22 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 500;
```

### Button — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 1 instance, 1 variant

**Variant 1** (1 instance)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 4 instances, 1 variant

**Variant 1** (4 instances)

```css
  background: rgb(255, 255, 255);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.11);
  font-size: 16px;
  font-weight: 300;
```

### Card — 4 instances, 1 variant

**Variant 1** (4 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 32px 24px 0px 24px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 4 instances, 1 variant

**Variant 1** (4 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 3 instances, 1 variant

**Variant 1** (3 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 24px 32px 24px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 16 instances, 1 variant

**Variant 1** (16 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 8px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Other — 16 instances, 1 variant

**Variant 1** (16 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 16px;
  font-weight: 300;
```

### Card — 16 instances, 1 variant

**Variant 1** (16 instances)

```css
  background: rgba(0, 0, 0, 0);
  color: rgb(31, 31, 31);
  padding: 0px 0px 0px 0px;
  border-radius: 0px;
  border: 0px none rgb(31, 31, 31);
  font-size: 14px;
  font-weight: 300;
```

## Layout System

**96 grid containers** and **398 flex containers** detected.

### Container Widths

| Max Width | Padding |
|-----------|---------|
| 100% | 0px |
| 1080px | 32px |
| 630px | 0px |
| 710px | 16px |
| 620px | 0px |
| 343px | 0px |

### Grid Column Patterns

| Columns | Usage Count |
|---------|-------------|
| 3-column | 55x |
| 2-column | 27x |
| 1-column | 5x |
| 4-column | 3x |

### Grid Templates

```css
grid-template-columns: 258px 258px 258px 258px;
gap: 24px 16px;
grid-template-columns: 256px;
grid-template-columns: 256px;
grid-template-columns: 256px;
grid-template-columns: 256px;
```

### Flex Patterns

| Direction/Wrap | Count |
|----------------|-------|
| row/nowrap | 220x |
| column/nowrap | 160x |
| row/wrap | 14x |
| row-reverse/nowrap | 1x |
| column/wrap | 3x |

**Gap values:** `0px 20px`, `0px 8px`, `12px`, `12px 16px`, `12px 8px`, `16px`, `16px 24px`, `16px 28px`, `16px 48px`, `24px`, `24px 16px`, `28px`, `30px`, `40px`, `48px`, `4px`, `64px`, `6px`, `7px`, `80px`, `8px`, `normal 12px`, `normal 16px`, `normal 20px`, `normal 8px`

## Accessibility (WCAG 2.1)

**Overall Score: 100%** — 42 passing, 0 failing color pairs

### Passing Color Pairs

| Foreground | Background | Ratio | Level |
|------------|------------|-------|-------|
| `#1f1f1f` | `#ffffff` | 16.48:1 | AAA |
| `#ffffff` | `#ff4800` | 3.4:1 | AA |
| `#ff4800` | `#ffffff` | 3.4:1 | AA |
| `#ffffff` | `#1f1f1f` | 16.48:1 | AAA |
| `#1f1f1f` | `#fcfcfa` | 16.05:1 | AAA |

## Design System Score

**Overall: 86/100 (Grade: B)**

| Category | Score |
|----------|-------|
| Color Discipline | 100/100 |
| Typography Consistency | 50/100 |
| Spacing System | 100/100 |
| Shadow Consistency | 100/100 |
| Border Radius Consistency | 90/100 |
| Accessibility | 100/100 |
| CSS Tokenization | 100/100 |

**Strengths:** Tight, disciplined color palette, Well-defined spacing scale, Clean elevation system, Consistent border radii, Strong accessibility compliance, Good CSS variable tokenization

**Issues:**
- 4 font families — consider limiting to 2 (heading + body)
- 400 !important rules — prefer specificity over overrides
- 64% of CSS is unused — consider purging
- 4534 duplicate CSS declarations

## Gradients

**1 unique gradients** detected.

| Type | Direction | Stops | Classification |
|------|-----------|-------|----------------|
| linear | — | 2 | brand |

```css
background: linear-gradient(rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.46));
```

## Z-Index Map

**13 unique z-index values** across 4 layers.

| Layer | Range | Elements |
|-------|-------|----------|
| modal | 1000,99999 | div.c.l.-.m.o.d.a.l. .-.l.i.g.h.t, div.g.o.2.4.1.7.2.4.9.4.6.4. .g.o.6.1.3.3.0.5.1.5.5, div.g.o.2.4.1.7.2.4.9.4.6.4. .g.o.4.7.1.5.8.3.5.0.6 |
| dropdown | 100,100 | a.g.a._.n.a.v._.l.i.n.k. .c.l.-.b.u.t.t.o.n. .-.t.e.r.t.i.a.r.y. .-.s.m.a.l.l. .g.l.o.b.a.l.-.n.a.v.-.s.k.i.p.-.l.i.n.k |
| sticky | 51,99 | nav.g.l.o.b.a.l.-.n.a.v.-.m.a.i.n, header.g.l.o.b.a.l.-.n.a.v.-.h.e.a.d.e.r, ul.g.l.o.b.a.l.-.n.a.v.-.m.o.b.i.l.e.-.s.u.b.m.e.n.u. .-.i.s.-.d.r.o.p.d.o.w.n |
| base | -1,1 | div.c.l.-.l.o.a.d.i.n.g. .-.d.a.r.k. .-.m.e.d.i.u.m. .-.s.e.c.o.n.d.a.r.y, div.g.o.1.6.3.2.9.4.9.0.4.9, div.h.s.-.s.h.a.d.o.w.-.c.o.n.t.a.i.n.e.r |

**Issues:**
- [object Object]

## SVG Icons

**30 unique SVG icons** detected. Dominant style: **filled**.

| Size Class | Count |
|------------|-------|
| xs | 4 |
| sm | 5 |
| md | 20 |
| xl | 1 |

**Icon colors:** `currentColor`, `rgb(255, 255, 255)`, `rgb(0, 0, 0)`, `black`, `rgb(31, 31, 31)`, `#FF5C35`, `#FF4800`, `white`, `#141414`, `rgba(0, 0, 0, 0.2)`

## Font Files

| Family | Source | Weights | Styles |
|--------|--------|---------|--------|
| HubSpot Sans | self-hosted | 300 400, 500 600 | normal |
| HubSpot Serif | self-hosted | 300, 400 600 | normal |
| Zen Kaku Gothic New | self-hosted | 300 400, 500, 700 | normal |
| Lato | google-fonts | 400, 700 | italic, normal |

**Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;1,400&display=swap`

## Image Style Patterns

| Pattern | Count | Key Styles |
|---------|-------|------------|
| thumbnail | 22 | objectFit: fill, borderRadius: 0px, shape: square |
| general | 5 | objectFit: contain, borderRadius: 0px, shape: square |
| gallery | 3 | objectFit: contain, borderRadius: 0px, shape: square |
| avatar | 3 | objectFit: cover, borderRadius: 50%, shape: circular |

**Aspect ratios:** 1:1 (17x), 4:3 (5x), 1.99:1 (3x), 16:9 (3x), 2.01:1 (2x), 3.53:1 (1x), 21:9 (1x), 3.33:1 (1x)

## Motion Language

**Feel:** smooth · **Scroll-linked:** yes

### Duration Tokens

| name | value | ms |
|---|---|---|
| `instant` | `10ms` | 10 |
| `xs` | `100ms` | 100 |
| `sm` | `200ms` | 200 |
| `md` | `300ms` | 300 |
| `lg` | `500ms` | 500 |

### Easing Families

- **ease-in-out** (58 uses) — `ease`
- **linear** (13 uses) — `linear`

### Keyframes In Use

| name | kind | properties | uses |
|---|---|---|---|
| `banner_animation` | slide-y | transform, opacity | 1 |

## Component Anatomy

### card — 219 instances

**Slots:** media, footer
**Sizes:** small

### button — 32 instances

**Slots:** label
**Variants:** tertiary · primary · secondary
**Sizes:** small · medium · large

| variant | count | sample label |
|---|---|---|
| default | 23 | ×
close |
| primary | 6 | Free HubSpot CRM |
| secondary | 2 | Learn about premium CRM |
| tertiary | 1 | Skip to content |

### link — 32 instances

**Variants:** link

### other — 16 instances


## Brand Voice

**Tone:** friendly · **Pronoun:** you-only · **Headings:** Sentence case (tight)

### Top CTA Verbs

- **get** (8)
- **close** (3)
- **manage** (2)
- **by** (2)
- **automate** (2)
- **previous** (2)
- **next** (2)
- **learn** (2)

### Button Copy Patterns

- "get free crm" (5×)
- "×
close" (2×)
- "previous" (2×)
- "next" (2×)
- "learn about premium crm" (2×)
- "accept all" (1×)
- "decline all" (1×)
- "manage cookies" (1×)
- "skip to content" (1×)
- "select a language" (1×)

### Sample Headings

> Free CRM Software for Startups & Small Businesses
> Trusted by over 299,000 customers in more than 135 countries.
> The Free CRM With Unlimited Growth Potential
> Contact management
> CRM import
> Deals
> Task & activities
> Pipeline management
> HubSpot Marketplace
> Data sync

## Page Intent

**Type:** `product` (confidence 0.75)
**Description:** HubSpot’s free CRM powers your customer support, sales, and marketing with easy-to-use features like live chat, meeting scheduling, and email tracking.

## Section Roles

Reading order (top→bottom): cta → nav → nav → content → content → content → pricing → hero → logo-wall → testimonial → testimonial → testimonials → pricing → testimonial → pricing → testimonial → content → pricing-table → feature-grid → testimonial → feature-grid → pricing → footer → nav → feature-grid → pricing → hero → testimonials → logo-wall → content → content

| # | Role | Heading | Confidence |
|---|------|---------|------------|
| 0 | cta | — | 0.75 |
| 1 | nav | — | 0.9 |
| 2 | nav | — | 0.9 |
| 3 | content | — | 0.3 |
| 4 | content | — | 0.3 |
| 5 | content | — | 0.3 |
| 6 | pricing | — | 0.4 |
| 7 | hero | Free CRM Software for Startups & Small Businesses | 0.85 |
| 8 | logo-wall | Trusted by over 299,000 customers in more than 135 countries. | 0.85 |
| 9 | testimonial | The Free CRM With Unlimited Growth Potential | 0.8 |
| 10 | testimonial | — | 0.8 |
| 11 | testimonials | Contact management | 0.4 |
| 12 | pricing | HubSpot Marketplace | 0.4 |
| 13 | testimonial | Breeze Assistant | 0.8 |
| 14 | pricing | Integrate With Your Favorite Tools | 0.4 |
| 15 | testimonial | Get Set Up in Minutes, Without IT Support | 0.8 |
| 16 | content | Top-Rated CRM Software for Startups and Small Businesses | 0.3 |
| 17 | pricing-table | Scale Without Starting From Scratch | 0.9 |
| 18 | feature-grid | What is a CRM? | 0.8 |
| 19 | testimonial | Lead generation | 0.8 |

## Material Language

**Label:** `flat` (confidence 0)

| Metric | Value |
|--------|-------|
| Avg saturation | 0.495 |
| Shadow profile | soft |
| Avg shadow blur | 0px |
| Max radius | 50px |
| backdrop-filter in use | no |
| Gradients | 1 |

## Imagery Style

**Label:** `mixed` (confidence 0.111)
**Counts:** total 33, svg 17, icon 14, screenshot-like 0, photo-like 4
**Dominant aspect:** square-ish
**Radius profile on images:** soft

## Quick Start

To recreate this design in a new project:

1. **Install fonts:** Add `HubSpot Sans` from Google Fonts or your font provider
2. **Import CSS variables:** Copy `variables.css` into your project
3. **Tailwind users:** Use the generated `tailwind.config.js` to extend your theme
4. **Design tokens:** Import `design-tokens.json` for tooling integration
