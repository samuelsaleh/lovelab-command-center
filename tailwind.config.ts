import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        plum: { DEFAULT: '#6B3FA0', light: '#8B5FC0', dark: '#4A2D73', bg: '#F5F0FA' },
        gold: { DEFAULT: '#C9A96E', light: '#E8D5A8' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
