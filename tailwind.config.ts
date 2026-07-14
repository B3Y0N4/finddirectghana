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
          'green-50':   '#EBF5EE',
          'green-100':  '#C8E6D4',
          /* Rich amber-gold for UI — premium, not flag-yellow */
          gold:         '#C8920A',
          'gold-light': '#F5E0A8',
          'gold-dark':  '#A57808',
          'gold-50':    '#FDF4E3',
          'gold-muted': 'rgba(200,146,10,0.12)',
          /* Keep flag gold for the stripe only */
          'gold-flag':  '#FCD116',
          red:          '#CC0001',
          'red-light':  '#E82222',
        },
        ink:          '#12130F',
        muted:        '#5C6858',
        'page-bg':    '#F8F6F0',   /* warm cream */
        'card-bg':    '#FFFFFF',
        'border-col': '#D5CAB8',   /* earthy warm border */
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
        btn:   '6px',
        card:  '12px',
        badge: '99px',
      },
    },
  },
  plugins: [],
}

export default config
