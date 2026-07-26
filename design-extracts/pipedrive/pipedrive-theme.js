// React Theme — extracted from https://www.pipedrive.com/en/why-pipedrive
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
 *   };
 *   fonts: {
    body: string;
    heading: string;
 *   };
 *   fontSizes: {
    '14': string;
    '16': string;
    '18': string;
    '24': string;
    '36': string;
    '52': string;
    '14.4': string;
    '13.6': string;
    '13.3333': string;
    '13.008': string;
    '12.992': string;
    '12.8': string;
 *   };
 *   space: {
    '1': string;
    '15': string;
    '20': string;
    '23': string;
    '30': string;
    '32': string;
    '35': string;
    '40': string;
    '44': string;
    '80': string;
 *   };
 *   radii: {
    xs: string;
    sm: string;
    xl: string;
    full: string;
 *   };
 *   shadows: {
    sm: string;
    md: string;
    lg: string;
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
    "primary": "#6861f2",
    "secondary": "#e3fae1",
    "accent": "#3860be",
    "background": "#ffffff",
    "foreground": "#000000",
    "neutral50": "#000000",
    "neutral100": "#555555",
    "neutral200": "#ffffff",
    "neutral300": "#656565",
    "neutral400": "#f4f5f6",
    "neutral500": "#d8d8d8",
    "neutral600": "#bbbbbb"
  },
  "fonts": {
    "body": "'Inter', sans-serif",
    "heading": "'Haffer', sans-serif"
  },
  "fontSizes": {
    "14": "14px",
    "16": "16px",
    "18": "18px",
    "24": "24px",
    "36": "36px",
    "52": "52px",
    "14.4": "14.4px",
    "13.6": "13.6px",
    "13.3333": "13.3333px",
    "13.008": "13.008px",
    "12.992": "12.992px",
    "12.8": "12.8px"
  },
  "space": {
    "1": "1px",
    "15": "15px",
    "20": "20px",
    "23": "23px",
    "30": "30px",
    "32": "32px",
    "35": "35px",
    "40": "40px",
    "44": "44px",
    "80": "80px"
  },
  "radii": {
    "xs": "1px",
    "sm": "4px",
    "xl": "20px",
    "full": "100px"
  },
  "shadows": {
    "sm": "rgba(0, 0, 0, 0.08) 0px 3px 5px 0px, rgba(0, 0, 0, 0.12) 0px 0px 4px 0px",
    "md": "rgb(199, 197, 199) 0px 0px 12px 2px",
    "lg": "rgba(0, 0, 0, 0.2) 0px 0px 18px 0px"
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
      "main": "#6861f2",
      "light": "hsl(243, 85%, 81%)",
      "dark": "hsl(243, 85%, 51%)"
    },
    "secondary": {
      "main": "#e3fae1",
      "light": "hsl(115, 71%, 95%)",
      "dark": "hsl(115, 71%, 78%)"
    },
    "background": {
      "default": "#ffffff",
      "paper": "#f7f7fe"
    },
    "text": {
      "primary": "#000000",
      "secondary": "#192435"
    }
  },
  "typography": {
    "h1": {
      "fontSize": "36px",
      "fontWeight": "700",
      "lineHeight": "43px",
      "fontFamily": "'Haffer', sans-serif"
    },
    "h2": {
      "fontSize": "24px",
      "fontWeight": "400",
      "lineHeight": "normal",
      "fontFamily": "'Haffer', sans-serif"
    },
    "body1": {
      "fontSize": "16px",
      "fontWeight": "400",
      "lineHeight": "normal"
    },
    "body2": {
      "fontSize": "14.4px",
      "fontWeight": "400",
      "lineHeight": "38px"
    }
  },
  "shape": {
    "borderRadius": 1
  },
  "shadows": [
    "rgba(0, 0, 0, 0.08) 0px 3px 5px 0px, rgba(0, 0, 0, 0.12) 0px 0px 4px 0px",
    "rgb(199, 197, 199) -3px -3px 5px -2px",
    "rgb(153, 153, 153) 0px 2px 10px -3px",
    "rgb(199, 197, 199) 0px 0px 12px 2px",
    "rgba(0, 0, 0, 0.2) 0px 0px 18px 0px"
  ]
};

export default theme;
