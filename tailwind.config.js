/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // Pastel-lavender brand (used by focus rings and brand-* accents)
        brand: {
          50: '#f4f2fc',
          100: '#e9e5f8',
          200: '#d3ccf0',
          300: '#bcb1e7',
          400: '#a596de',
          500: '#8e7dd4',
          600: '#7867c4',
          700: '#6253a6',
          800: '#4d4185',
          900: '#3a3162',
        },
        // Soften the default indigo / purple so existing
        // `from-indigo-600 to-purple-600` gradients become pastel automatically.
        indigo: {
          50: '#f3f2fc',
          100: '#e8e4f7',
          200: '#d3cbf0',
          300: '#b8aae5',
          400: '#9d8bd9',
          500: '#8470c8',
          600: '#6f5cb4',
          700: '#5a4a96',
          800: '#473b78',
          900: '#372e5c',
        },
        purple: {
          50: '#fbf5fc',
          100: '#f4e8f6',
          200: '#e8d2ec',
          300: '#d6b1dd',
          400: '#c08fcb',
          500: '#a872b6',
          600: '#90599f',
          700: '#774884',
          800: '#5c3866',
          900: '#442c4b',
        },
        // Pastel accents for games / leaderboard / charts.
        mint: {
          50: '#effaf4',
          100: '#dbf3e5',
          200: '#bbe6cd',
          300: '#94d4af',
          400: '#6dc090',
          500: '#4fa874',
          600: '#3e8b5d',
          700: '#33704c',
          800: '#2a583d',
          900: '#22432f',
        },
        peach: {
          50: '#fff5ef',
          100: '#ffe6d6',
          200: '#ffcaa9',
          300: '#ffaa78',
          400: '#fc8c50',
          500: '#ee6f33',
          600: '#cf5a26',
          700: '#a4471f',
          800: '#7e3819',
          900: '#5e2b14',
        },
        sky: {
          50: '#eef7fb',
          100: '#daedf6',
          200: '#b7daed',
          300: '#8cc1de',
          400: '#62a6cb',
          500: '#458bb5',
          600: '#367298',
          700: '#2d5d7c',
          800: '#264a62',
          900: '#1f3a4d',
        },
      },
      boxShadow: {
        card: '0 14px 36px -18px rgba(127, 110, 200, 0.30)',
        soft: '0 8px 24px -12px rgba(127, 110, 200, 0.22)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulseDot: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.4 },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
