import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9f9fa',
          100: '#f3f3f5',
          200: '#e8e8eb',
          300: '#d8d8dd',
          400: '#a0a0a6',
          500: '#6b6b73',
          600: '#454550',
          700: '#2f2f33',
          800: '#1f1f22',
          900: '#0a0a0b',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
