// React Theme — extracted from https://twenty.com/
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
    neutral300: string;
    neutral400: string;
    neutral500: string;
    neutral600: string;
    neutral700: string;
    neutral800: string;
    neutral900: string;
 *   };
 *   fonts: {
    body: string;
    mono: string;
    heading: string;
 *   };
 *   fontSizes: {
    '13': string;
    '15': string;
    '16': string;
    '18': string;
    '20': string;
    '22': string;
    '32': string;
    '48': string;
    '60': string;
    '80': string;
    '18.72': string;
    '13.3333': string;
 *   };
 *   space: {
    '1': string;
    '19': string;
    '24': string;
    '28': string;
    '40': string;
    '48': string;
    '60': string;
    '64': string;
    '68': string;
    '80': string;
    '120': string;
    '160': string;
    '208': string;
 *   };
 *   radii: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
 *   };
 *   shadows: {
    sm: string;
    xs: string;
    xl: string;
 *   };
 *   states: {
 *     hover: { opacity: number };
 *     focus: { opacity: number };
 *     active: { opacity: number };
 *     disabled: { opacity: number };
 *   };
 * }
 */

export const theme = {
  "colors": {
    "primary": "#ff5f57",
    "secondary": "#febc2e",
    "accent": "#28c840",
    "background": "#ffffff",
    "foreground": "#000000",
    "neutral50": "#1c1c1c",
    "neutral100": "#000000",
    "neutral200": "#999999",
    "neutral300": "#ffffff",
    "neutral400": "#666666",
    "neutral500": "#333333",
    "neutral600": "#09090b",
    "neutral700": "#4b5563",
    "neutral800": "#b3b3b3",
    "neutral900": "#e5e7eb"
  },
  "fonts": {
    "body": "'Times New Roman', sans-serif",
    "mono": "'Azeret Mono', monospace",
    "heading": "'Aleo', sans-serif"
  },
  "fontSizes": {
    "13": "13px",
    "15": "15px",
    "16": "16px",
    "18": "18px",
    "20": "20px",
    "22": "22px",
    "32": "32px",
    "48": "48px",
    "60": "60px",
    "80": "80px",
    "18.72": "18.72px",
    "13.3333": "13.3333px"
  },
  "space": {
    "1": "1px",
    "19": "19px",
    "24": "24px",
    "28": "28px",
    "40": "40px",
    "48": "48px",
    "60": "60px",
    "64": "64px",
    "68": "68px",
    "80": "80px",
    "120": "120px",
    "160": "160px",
    "208": "208px"
  },
  "radii": {
    "xs": "1px",
    "sm": "4px",
    "md": "7px",
    "lg": "16px",
    "xl": "20px",
    "full": "999px"
  },
  "shadows": {
    "sm": "color(display-p3 0 0 0 / 0.039) 0px 2px 4px 0px, color(display-p3 0 0 0 / 0.078) 0px 0px 4px 0px",
    "xs": "rgba(0, 0, 0, 0.04) 0px 0px 1px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
    "xl": "rgba(0, 0, 0, 0.2) 0px 10px 64px 0px"
  },
  "states": {
    "hover": {
      "opacity": 0.08
    },
    "focus": {
      "opacity": 0.12
    },
    "active": {
      "opacity": 0.16
    },
    "disabled": {
      "opacity": 0.38
    }
  }
};

// MUI v5 theme
export const muiTheme = {
  "palette": {
    "primary": {
      "main": "#ff5f57",
      "light": "hsl(3, 100%, 82%)",
      "dark": "hsl(3, 100%, 52%)"
    },
    "secondary": {
      "main": "#febc2e",
      "light": "hsl(41, 99%, 74%)",
      "dark": "hsl(41, 99%, 44%)"
    },
    "background": {
      "default": "#ffffff",
      "paper": "#f4f4f4"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#1c1c1c"
    }
  },
  "typography": {
    "fontFamily": "'inter', sans-serif",
    "h1": {
      "fontSize": "32px",
      "fontWeight": "400",
      "lineHeight": "40px",
      "fontFamily": "'Aleo', sans-serif"
    },
    "h3": {
      "fontSize": "20px",
      "fontWeight": "500",
      "lineHeight": "17.011px",
      "fontFamily": "'Aleo', sans-serif"
    }
  },
  "shape": {
    "borderRadius": 7
  },
  "shadows": [
    "rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.12) 0px 1px 2px 0px",
    "rgba(255, 255, 255, 0.6) 0px 0px 0px 1px",
    "rgba(241, 241, 241, 0.9) 0px 0px 0px 1px",
    "rgb(221, 243, 228) 0px 0px 0px 1px inset",
    "rgba(255, 255, 255, 0.16) 0px 0px 0px 1px, rgba(0, 0, 0, 0.28) 0px 20px 48px 0px"
  ]
};

export default theme;
