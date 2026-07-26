// React Theme — extracted from https://www.hubspot.com/products/crm
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
 *   };
 *   fonts: {
    body: string;
    heading: string;
 *   };
 *   fontSizes: {
    '12': string;
    '14': string;
    '16': string;
    '18': string;
    '22': string;
    '24': string;
    '32': string;
    '40': string;
    '48': string;
    '12.8': string;
 *   };
 *   space: {
    '1': string;
    '20': string;
    '24': string;
    '40': string;
    '48': string;
    '52': string;
    '56': string;
    '64': string;
    '68': string;
    '80': string;
    '96': string;
    '100': string;
    '165': string;
 *   };
 *   radii: {
    sm: string;
    md: string;
    lg: string;
    full: string;
 *   };
 *   shadows: {
    sm: string;
    lg: string;
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
    "primary": "#f8f5ee",
    "secondary": "#ff4800",
    "accent": "#042729",
    "background": "#fcfcfa",
    "foreground": "#1f1f1f",
    "neutral50": "#1f1f1f",
    "neutral100": "#000000",
    "neutral200": "#f0f0f0"
  },
  "fonts": {
    "body": "'Zen Kaku Gothic New', sans-serif",
    "heading": "'HubSpot Serif', sans-serif"
  },
  "fontSizes": {
    "12": "12px",
    "14": "14px",
    "16": "16px",
    "18": "18px",
    "22": "22px",
    "24": "24px",
    "32": "32px",
    "40": "40px",
    "48": "48px",
    "12.8": "12.8px"
  },
  "space": {
    "1": "1px",
    "20": "20px",
    "24": "24px",
    "40": "40px",
    "48": "48px",
    "52": "52px",
    "56": "56px",
    "64": "64px",
    "68": "68px",
    "80": "80px",
    "96": "96px",
    "100": "100px",
    "165": "165px"
  },
  "radii": {
    "sm": "3px",
    "md": "6px",
    "lg": "16px",
    "full": "50px"
  },
  "shadows": {
    "sm": "rgba(33, 51, 67, 0.12) 0px 2px 4px 0px",
    "lg": "rgba(33, 51, 67, 0.12) 0px 1px 24px 0px",
    "xl": "rgba(0, 0, 0, 0.28) 0px 8px 28px 0px"
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
      "main": "#f8f5ee",
      "light": "hsl(42, 42%, 95%)",
      "dark": "hsl(42, 42%, 80%)"
    },
    "secondary": {
      "main": "#ff4800",
      "light": "hsl(17, 100%, 65%)",
      "dark": "hsl(17, 100%, 35%)"
    },
    "background": {
      "default": "#fcfcfa",
      "paper": "#1f1f1f"
    },
    "text": {
      "primary": "#1f1f1f",
      "secondary": "#15295a"
    }
  },
  "typography": {
    "fontFamily": "'Times New Roman', sans-serif",
    "h1": {
      "fontSize": "32px",
      "fontWeight": "400",
      "lineHeight": "56px",
      "fontFamily": "'HubSpot Serif', sans-serif"
    },
    "h2": {
      "fontSize": "24px",
      "fontWeight": "500",
      "lineHeight": "34px",
      "fontFamily": "'HubSpot Serif', sans-serif"
    },
    "h3": {
      "fontSize": "22px",
      "fontWeight": "500",
      "lineHeight": "32px",
      "fontFamily": "'HubSpot Serif', sans-serif"
    },
    "body1": {
      "fontSize": "18px",
      "fontWeight": "500",
      "lineHeight": "28px"
    }
  },
  "shape": {
    "borderRadius": 6
  },
  "shadows": [
    "rgba(0, 0, 0, 0) 0px 0px 0px 1px",
    "rgba(33, 51, 67, 0.12) 0px 2px 4px 0px",
    "rgba(33, 51, 67, 0.12) 0px 1px 24px 0px",
    "rgba(0, 0, 0, 0.28) 0px 8px 28px 0px"
  ]
};

export default theme;
