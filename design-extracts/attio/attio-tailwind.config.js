/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        'neutral-50': '#030303',
        'neutral-100': '#ffffff',
        'neutral-200': '#c1c1c1',
        background: '#ffffff',
        foreground: '#030303'
    },
    fontFamily: {
        sans: [
            'inter',
            'sans-serif'
        ],
        heading: [
            'interDisplay',
            'sans-serif'
        ]
    },
    fontSize: {
        '10': [
            '10px',
            {
                lineHeight: '7px'
            }
        ],
        '12': [
            '12px',
            {
                lineHeight: '16px',
                letterSpacing: '0.72px'
            }
        ],
        '13': [
            '13px',
            {
                lineHeight: '20px',
                letterSpacing: '-0.16px'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '20px',
                letterSpacing: '-0.07px'
            }
        ],
        '15': [
            '15px',
            {
                lineHeight: '22px',
                letterSpacing: '-0.16px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: '22px',
                letterSpacing: '-0.16px'
            }
        ],
        '20': [
            '20px',
            {
                lineHeight: '26px',
                letterSpacing: '-0.2px'
            }
        ],
        '56': [
            '56px',
            {
                lineHeight: '60px',
                letterSpacing: '-0.84px'
            }
        ]
    },
    spacing: {
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '10': '40px',
        '12': '48px',
        '20': '80px',
        '29': '116px',
        '30': '120px',
        '1px': '1px',
        '15px': '15px'
    },
    borderRadius: {
        xs: '2px',
        md: '8px',
        lg: '16px',
        xl: '19px'
    },
    boxShadow: {
        sm: 'rgb(128, 128, 128) 0px 0px 5px 0px',
        xs: 'oklch(0 0 0 / 0.01) 0px 1px 2px 0px, oklch(0 0 0 / 0.02) 0px 2px 4px -1px, oklch(0 0 0 / 0.03) 0px 4px 8px -2px'
    },
    screens: {
        lg: '992px'
    },
    transitionDuration: {
        '150': '0.15s',
        '200': '0.2s',
        '250': '0.25s',
        '300': '0.3s',
        '400': '0.4s',
        '700': '0.7s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0, 0, 0, 1)'
    },
    container: {
        center: true,
        padding: '24px'
    },
    maxWidth: {
        container: '1440px'
    }
},
  },
};
