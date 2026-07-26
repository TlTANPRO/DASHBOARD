// React Theme — extracted from https://attio.com/product
// Compatible with: Chakra UI, Stitches, Vanilla Extract, or any CSS-in-JS

/**
 * TypeScript type definition for this theme:
 *
 * interface Theme {
 *   colors: {
    background: string;
    foreground: string;
    neutral50: string;
    neutral100: string;
    neutral200: string;
 *   };
 *   fonts: {
    body: string;
 *   };
 *   fontSizes: {
    '10': string;
    '12': string;
    '13': string;
    '14': string;
    '15': string;
    '16': string;
    '20': string;
    '56': string;
 *   };
 *   space: {
    '1': string;
    '15': string;
    '20': string;
    '24': string;
    '28': string;
    '40': string;
    '48': string;
    '80': string;
    '116': string;
    '120': string;
 *   };
 *   radii: {
    xs: string;
    md: string;
    lg: string;
    xl: string;
 *   };
 *   shadows: {
    sm: string;
    xs: string;
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
    "background": "#ffffff",
    "foreground": "#030303",
    "neutral50": "#030303",
    "neutral100": "#ffffff",
    "neutral200": "#c1c1c1"
  },
  "fonts": {
    "body": "'interDisplay', sans-serif"
  },
  "fontSizes": {
    "10": "10px",
    "12": "12px",
    "13": "13px",
    "14": "14px",
    "15": "15px",
    "16": "16px",
    "20": "20px",
    "56": "56px"
  },
  "space": {
    "1": "1px",
    "15": "15px",
    "20": "20px",
    "24": "24px",
    "28": "28px",
    "40": "40px",
    "48": "48px",
    "80": "80px",
    "116": "116px",
    "120": "120px"
  },
  "radii": {
    "xs": "2px",
    "md": "8px",
    "lg": "16px",
    "xl": "19px"
  },
  "shadows": {
    "sm": "rgb(128, 128, 128) 0px 0px 5px 0px",
    "xs": "oklch(0 0 0 / 0.01) 0px 1px 2px 0px, oklch(0 0 0 / 0.02) 0px 2px 4px -1px, oklch(0 0 0 / 0.03) 0px 4px 8px -2px"
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
    "background": {
      "default": "#ffffff",
      "paper": "#ffffff"
    },
    "text": {
      "primary": "#030303"
    }
  },
  "typography": {
    "h1": {
      "fontSize": "56px",
      "fontWeight": "600",
      "lineHeight": "60px"
    },
    "h3": {
      "fontSize": "20px",
      "fontWeight": "500",
      "lineHeight": "26px"
    },
    "body1": {
      "fontSize": "16px",
      "fontWeight": "500",
      "lineHeight": "22px"
    },
    "body2": {
      "fontSize": "13px",
      "fontWeight": "500",
      "lineHeight": "20px"
    }
  },
  "shape": {
    "borderRadius": 8
  },
  "shadows": [
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(28, 29, 31, 0.1) 0px 0px 0px 1px, rgba(28, 29, 31, 0.05) 0px 1px 2px 0px, rgba(28, 29, 31, 0.02) 0px 2px 4px -1px, rgba(28, 29, 31, 0.03) 0px 4px 8px -2px, rgba(28, 29, 31, 0.04) 0px 8px 16px -4px, rgba(28, 29, 31, 0.05) 0px 16px 32px -8px, rgba(28, 29, 31, 0.06) 0px 32px 64px -8px",
    "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, oklch(0 0 0 / 0.01) 0px 1px 3px 0px, oklch(0 0 0 / 0.02) 0px 2px 4px -1px, oklch(0 0 0 / 0.03) 0px 4px 8px -2px, oklch(0 0 0 / 0.04) 0px 8px 16px -4px, oklch(0 0 0 / 0.05) 0px 16px 32px -8px",
    "oklch(0 0 0 / 0.01) 0px 1px 2px 0px, oklch(0 0 0 / 0.02) 0px 2px 4px -1px, oklch(0 0 0 / 0.03) 0px 4px 8px -2px",
    "rgb(128, 128, 128) 0px 0px 5px 0px"
  ]
};

export default theme;
