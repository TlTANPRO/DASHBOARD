/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(42, 42%, 97%)',
            '100': 'hsl(42, 42%, 94%)',
            '200': 'hsl(42, 42%, 86%)',
            '300': 'hsl(42, 42%, 76%)',
            '400': 'hsl(42, 42%, 64%)',
            '500': 'hsl(42, 42%, 50%)',
            '600': 'hsl(42, 42%, 40%)',
            '700': 'hsl(42, 42%, 32%)',
            '800': 'hsl(42, 42%, 24%)',
            '900': 'hsl(42, 42%, 16%)',
            '950': 'hsl(42, 42%, 10%)',
            DEFAULT: '#f8f5ee'
        },
        secondary: {
            '50': 'hsl(17, 100%, 97%)',
            '100': 'hsl(17, 100%, 94%)',
            '200': 'hsl(17, 100%, 86%)',
            '300': 'hsl(17, 100%, 76%)',
            '400': 'hsl(17, 100%, 64%)',
            '500': 'hsl(17, 100%, 50%)',
            '600': 'hsl(17, 100%, 40%)',
            '700': 'hsl(17, 100%, 32%)',
            '800': 'hsl(17, 100%, 24%)',
            '900': 'hsl(17, 100%, 16%)',
            '950': 'hsl(17, 100%, 10%)',
            DEFAULT: '#ff4800'
        },
        accent: {
            '50': 'hsl(183, 82%, 97%)',
            '100': 'hsl(183, 82%, 94%)',
            '200': 'hsl(183, 82%, 86%)',
            '300': 'hsl(183, 82%, 76%)',
            '400': 'hsl(183, 82%, 64%)',
            '500': 'hsl(183, 82%, 50%)',
            '600': 'hsl(183, 82%, 40%)',
            '700': 'hsl(183, 82%, 32%)',
            '800': 'hsl(183, 82%, 24%)',
            '900': 'hsl(183, 82%, 16%)',
            '950': 'hsl(183, 82%, 10%)',
            DEFAULT: '#042729'
        },
        'neutral-50': '#1f1f1f',
        'neutral-100': '#000000',
        'neutral-200': '#f0f0f0',
        background: '#fcfcfa',
        foreground: '#1f1f1f'
    },
    fontFamily: {
        sans: [
            'HubSpot Sans',
            'sans-serif'
        ],
        body: [
            'Zen Kaku Gothic New',
            'sans-serif'
        ],
        heading: [
            'HubSpot Serif',
            'sans-serif'
        ]
    },
    fontSize: {
        '12': [
            '12px',
            {
                lineHeight: '20px'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '24.5px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: '18.4px'
            }
        ],
        '18': [
            '18px',
            {
                lineHeight: '28px'
            }
        ],
        '22': [
            '22px',
            {
                lineHeight: '32px'
            }
        ],
        '24': [
            '24px',
            {
                lineHeight: '34px'
            }
        ],
        '32': [
            '32px',
            {
                lineHeight: '56px'
            }
        ],
        '40': [
            '40px',
            {
                lineHeight: '44px'
            }
        ],
        '48': [
            '48px',
            {
                lineHeight: '55.3846px'
            }
        ],
        '12.8': [
            '12.8px',
            {
                lineHeight: '19.2px'
            }
        ]
    },
    spacing: {
        '5': '20px',
        '6': '24px',
        '10': '40px',
        '12': '48px',
        '13': '52px',
        '14': '56px',
        '16': '64px',
        '17': '68px',
        '20': '80px',
        '24': '96px',
        '25': '100px',
        '1px': '1px',
        '165px': '165px'
    },
    borderRadius: {
        sm: '3px',
        md: '6px',
        lg: '16px',
        full: '50px'
    },
    boxShadow: {
        sm: 'rgba(33, 51, 67, 0.12) 0px 2px 4px 0px',
        lg: 'rgba(33, 51, 67, 0.12) 0px 1px 24px 0px',
        xl: 'rgba(0, 0, 0, 0.28) 0px 8px 28px 0px'
    },
    screens: {
        sm: '544px'
    },
    transitionDuration: {
        '0': '0s',
        '10': '0.01s',
        '100': '0.1s',
        '150': '0.15s',
        '200': '0.2s',
        '300': '0.3s',
        '400': '0.4s',
        '500': '0.5s'
    },
    transitionTimingFunction: {
        default: 'ease',
        linear: 'linear'
    },
    container: {
        center: true,
        padding: '0px'
    },
    maxWidth: {
        container: '100%'
    }
},
  },
};
