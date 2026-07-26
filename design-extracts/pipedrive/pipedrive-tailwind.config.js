/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(243, 85%, 97%)',
            '100': 'hsl(243, 85%, 94%)',
            '200': 'hsl(243, 85%, 86%)',
            '300': 'hsl(243, 85%, 76%)',
            '400': 'hsl(243, 85%, 64%)',
            '500': 'hsl(243, 85%, 50%)',
            '600': 'hsl(243, 85%, 40%)',
            '700': 'hsl(243, 85%, 32%)',
            '800': 'hsl(243, 85%, 24%)',
            '900': 'hsl(243, 85%, 16%)',
            '950': 'hsl(243, 85%, 10%)',
            DEFAULT: '#6861f2'
        },
        secondary: {
            '50': 'hsl(115, 71%, 97%)',
            '100': 'hsl(115, 71%, 94%)',
            '200': 'hsl(115, 71%, 86%)',
            '300': 'hsl(115, 71%, 76%)',
            '400': 'hsl(115, 71%, 64%)',
            '500': 'hsl(115, 71%, 50%)',
            '600': 'hsl(115, 71%, 40%)',
            '700': 'hsl(115, 71%, 32%)',
            '800': 'hsl(115, 71%, 24%)',
            '900': 'hsl(115, 71%, 16%)',
            '950': 'hsl(115, 71%, 10%)',
            DEFAULT: '#e3fae1'
        },
        accent: {
            '50': 'hsl(222, 54%, 97%)',
            '100': 'hsl(222, 54%, 94%)',
            '200': 'hsl(222, 54%, 86%)',
            '300': 'hsl(222, 54%, 76%)',
            '400': 'hsl(222, 54%, 64%)',
            '500': 'hsl(222, 54%, 50%)',
            '600': 'hsl(222, 54%, 40%)',
            '700': 'hsl(222, 54%, 32%)',
            '800': 'hsl(222, 54%, 24%)',
            '900': 'hsl(222, 54%, 16%)',
            '950': 'hsl(222, 54%, 10%)',
            DEFAULT: '#3860be'
        },
        'neutral-50': '#000000',
        'neutral-100': '#555555',
        'neutral-200': '#ffffff',
        'neutral-300': '#656565',
        'neutral-400': '#f4f5f6',
        'neutral-500': '#d8d8d8',
        'neutral-600': '#bbbbbb',
        background: '#ffffff',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Inter',
            'sans-serif'
        ],
        heading: [
            'Haffer',
            'sans-serif'
        ]
    },
    fontSize: {
        '12': [
            '12px',
            {
                lineHeight: '22px'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '25px'
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
                lineHeight: '30px'
            }
        ],
        '24': [
            '24px',
            {
                lineHeight: 'normal'
            }
        ],
        '36': [
            '36px',
            {
                lineHeight: '43px'
            }
        ],
        '52': [
            '52px',
            {
                lineHeight: '62px'
            }
        ],
        '14.4': [
            '14.4px',
            {
                lineHeight: '38px',
                letterSpacing: '0.144px'
            }
        ],
        '13.6': [
            '13.6px',
            {
                lineHeight: '27.2px'
            }
        ],
        '13.3333': [
            '13.3333px',
            {
                lineHeight: 'normal'
            }
        ],
        '13.008': [
            '13.008px',
            {
                lineHeight: '16.9104px'
            }
        ],
        '12.992': [
            '12.992px',
            {
                lineHeight: '19.488px'
            }
        ],
        '12.8': [
            '12.8px',
            {
                lineHeight: 'normal'
            }
        ]
    },
    spacing: {
        '10': '20px',
        '15': '30px',
        '16': '32px',
        '20': '40px',
        '22': '44px',
        '40': '80px',
        '1px': '1px',
        '15px': '15px',
        '23px': '23px',
        '35px': '35px'
    },
    borderRadius: {
        xs: '1px',
        sm: '4px',
        xl: '20px',
        full: '100px'
    },
    boxShadow: {
        sm: 'rgba(0, 0, 0, 0.08) 0px 3px 5px 0px, rgba(0, 0, 0, 0.12) 0px 0px 4px 0px',
        md: 'rgb(199, 197, 199) 0px 0px 12px 2px',
        lg: 'rgba(0, 0, 0, 0.2) 0px 0px 18px 0px'
    },
    screens: {
        xs: '320px',
        '400px': '400px',
        sm: '426px',
        md: '769px',
        '890px': '890px',
        '897px': '897px',
        lg: '1024px',
        '1104px': '1104px',
        xl: '1280px',
        '1400px': '1400px',
        '2xl': '1600px',
        '2000px': '2000px'
    },
    transitionDuration: {
        '100': '0.1s',
        '180': '0.18s',
        '200': '0.2s',
        '250': '0.25s',
        '320': '0.32s',
        '400': '0.4s',
        '500': '0.5s'
    },
    transitionTimingFunction: {
        default: 'ease',
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    container: {
        center: true,
        padding: '20px'
    },
    maxWidth: {
        container: '1600px'
    }
},
  },
};
