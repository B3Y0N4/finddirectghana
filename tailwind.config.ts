import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Poppins', 'system-ui', 'sans-serif'],
        sans:    ['var(--font-sans)',    'Inter',   'system-ui', 'sans-serif'],
      },
      colors: {
        ghana: {
          green:        '#006B3F',
          'green-light':'#00894E',
          'green-dark': '#004D2C',
          'green-50':   '#E8F5ED',
          'green-100':  '#C3E3D0',
          gold:         '#FCD116',
          'gold-light': '#FEDE50',
          'gold-dark':  '#D9B200',
          'gold-muted': 'rgba(252,209,22,0.15)',
          red:          '#CC0001',
          'red-light':  '#FF2222',
        },
        ink:    '#0C1A12',
        muted:  '#4A6B5A',
        'page-bg':    '#F7FAF8',
        'card-bg':    '#FFFFFF',
        'border-col': '#C5D9CE',
      },
      maxWidth: {
        site:    '1440px',
        content: '1240px',
        prose:   '720px',
      },
      boxShadow: {
        card:       '0 2px 16px rgba(12,26,18,0.07)',
        'card-hover':'0 8px 40px rgba(12,26,18,0.13)',
        nav:        '0 1px 0 0 rgba(12,26,18,0.09)',
      },
      borderRadius: {
        btn: '4px',
        card: '8px',
        badge: '99px',
      },
    },
  },
  plugins: [],
}

export default config
