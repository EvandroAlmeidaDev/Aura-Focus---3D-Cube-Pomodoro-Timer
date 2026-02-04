/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lcd: ['Orbitron', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'cube-dark': '#1a1a1a',
        'cube-darker': '#0a0a0a',
        'focus': '#ef4444',
        'short-break': '#10b981',
        'long-break': '#3b82f6',
        'settings': '#8b5cf6',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
