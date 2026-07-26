/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(3, 100%, 97%)',
            '100': 'hsl(3, 100%, 94%)',
            '200': 'hsl(3, 100%, 86%)',
            '300': 'hsl(3, 100%, 76%)',
            '400': 'hsl(3, 100%, 64%)',
            '500': 'hsl(3, 100%, 50%)',
            '600': 'hsl(3, 100%, 40%)',
            '700': 'hsl(3, 100%, 32%)',
            '800': 'hsl(3, 100%, 24%)',
            '900': 'hsl(3, 100%, 16%)',
            '950': 'hsl(3, 100%, 10%)',
            DEFAULT: '#ff5f57'
        },
        secondary: {
            '50': 'hsl(41, 99%, 97%)',
            '100': 'hsl(41, 99%, 94%)',
            '200': 'hsl(41, 99%, 86%)',
            '300': 'hsl(41, 99%, 76%)',
            '400': 'hsl(41, 99%, 64%)',
            '500': 'hsl(41, 99%, 50%)',
            '600': 'hsl(41, 99%, 40%)',
            '700': 'hsl(41, 99%, 32%)',
            '800': 'hsl(41, 99%, 24%)',
            '900': 'hsl(41, 99%, 16%)',
            '950': 'hsl(41, 99%, 10%)',
            DEFAULT: '#febc2e'
        },
        accent: {
            '50': 'hsl(129, 67%, 97%)',
            '100': 'hsl(129, 67%, 94%)',
            '200': 'hsl(129, 67%, 86%)',
            '300': 'hsl(129, 67%, 76%)',
            '400': 'hsl(129, 67%, 64%)',
            '500': 'hsl(129, 67%, 50%)',
            '600': 'hsl(129, 67%, 40%)',
            '700': 'hsl(129, 67%, 32%)',
            '800': 'hsl(129, 67%, 24%)',
            '900': 'hsl(129, 67%, 16%)',
            '950': 'hsl(129, 67%, 10%)',
            DEFAULT: '#28c840'
        },
        'neutral-50': '#1c1c1c',
        'neutral-100': '#000000',
        'neutral-200': '#999999',
        'neutral-300': '#ffffff',
        'neutral-400': '#666666',
        'neutral-500': '#333333',
        'neutral-600': '#09090b',
        'neutral-700': '#4b5563',
        'neutral-800': '#b3b3b3',
        'neutral-900': '#e5e7eb',
        background: '#ffffff',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Host Grotesk',
            'sans-serif'
        ],
        body: [
            'Times New Roman',
            'sans-serif'
        ],
        heading: [
            'Aleo',
            'sans-serif'
        ]
    },
    fontSize: {
        '11': [
            '11px',
            {
                lineHeight: '11px'
            }
        ],
        '12': [
            '12px',
            {
                lineHeight: 'normal'
            }
        ],
        '13': [
            '13px',
            {
                lineHeight: '18.2px'
            }
        ],
        '15': [
            '15px',
            {
                lineHeight: 'normal',
                letterSpacing: '-0.3px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ],
        '18': [
            '18px',
            {
                lineHeight: '24px',
                letterSpacing: '-0.72px'
            }
        ],
        '20': [
            '20px',
            {
                lineHeight: '17.011px'
            }
        ],
        '22': [
            '22px',
            {
                lineHeight: '28px'
            }
        ],
        '32': [
            '32px',
            {
                lineHeight: '40px'
            }
        ],
        '48': [
            '48px',
            {
                lineHeight: '56px',
                letterSpacing: '-0.96px'
            }
        ],
        '60': [
            '60px',
            {
                lineHeight: '66px',
                letterSpacing: '-1.2px'
            }
        ],
        '80': [
            '80px',
            {
                lineHeight: '86px',
                letterSpacing: '-1.6px'
            }
        ],
        '18.72': [
            '18.72px',
            {
                lineHeight: 'normal'
            }
        ],
        '13.3333': [
            '13.3333px',
            {
                lineHeight: 'normal'
            }
        ],
        '11.95': [
            '11.95px',
            {
                lineHeight: '16.73px'
            }
        ]
    },
    spacing: {
        '6': '24px',
        '7': '28px',
        '10': '40px',
        '12': '48px',
        '15': '60px',
        '16': '64px',
        '17': '68px',
        '20': '80px',
        '30': '120px',
        '40': '160px',
        '52': '208px',
        '1px': '1px',
        '19px': '19px'
    },
    borderRadius: {
        xs: '1px',
        sm: '4px',
        md: '7px',
        lg: '16px',
        xl: '20px',
        full: '999px'
    },
    boxShadow: {
        sm: 'color(display-p3 0 0 0 / 0.039) 0px 2px 4px 0px, color(display-p3 0 0 0 / 0.078) 0px 0px 4px 0px',
        xs: 'rgba(0, 0, 0, 0.04) 0px 0px 1px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
        xl: 'rgba(0, 0, 0, 0.2) 0px 10px 64px 0px'
    },
    screens: {
        '921px': '921px',
        xl: '1281px',
        '1350px': '1350px'
    },
    transitionDuration: {
        '100': '0.1s',
        '120': '0.12s',
        '140': '0.14s',
        '150': '0.15s',
        '160': '0.16s',
        '180': '0.18s',
        '200': '0.2s',
        '220': '0.22s',
        '240': '0.24s',
        '260': '0.26s',
        '280': '0.28s',
        '300': '0.3s',
        '320': '0.32s',
        '340': '0.34s',
        '400': '0.4s',
        '420': '0.42s',
        '500': '0.5s',
        '520': '0.52s',
        '600': '0.6s',
        '620': '0.62s'
    },
    transitionTimingFunction: {
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)',
        linear: 'linear',
        default: 'ease'
    },
    container: {
        center: true,
        padding: '40px'
    },
    maxWidth: {
        container: '1512px'
    }
},
  },
};
