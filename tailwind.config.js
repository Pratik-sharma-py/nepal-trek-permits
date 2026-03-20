/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['"Courier Prime"', 'monospace'],
      },
      colors: {
        ink:   { DEFAULT: '#0E0E0E', 50: '#1A1A1A', 100: '#141414' },
        cream: { DEFAULT: '#F2EDE4', muted: '#A89880', faint: '#2A2520' },
        gold:  { DEFAULT: '#C9A84C', light: '#E2C97E', dark: '#9B7B2E' },
        sage:  { DEFAULT: '#4A7C6F', light: '#6BA394', dark: '#2E5248' },
        ember: { DEFAULT: '#C4622D', light: '#E08050' },
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
