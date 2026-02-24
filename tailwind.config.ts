import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: '#5D3A5E',
          light: '#8957AF',
          dark: '#4A2545',
          bg: '#F7F0F8',
        },
        gold: {
          DEFAULT: '#C9A665',
          light: '#E8D5A8',
          dark: '#A67C3A',
        },
        lovelab: {
          bg: '#FDF7FA',
          muted: '#8A6A7D',
          accent: '#C4A084',
          pink: '#D486C3',
          border: '#DCC5D5',
        },
        ivory: '#F8F5F2',
        rose: '#F0B5C0',
        lavender: '#D1B3E0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        label: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
