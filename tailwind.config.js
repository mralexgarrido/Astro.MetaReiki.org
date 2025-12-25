/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        reiki: {
          cyan: '#00f2ff',
          magenta: '#ff00ff',
          dark: '#050b14',
          card: '#0f172a',
        },
        zodiac: {
          fire: '#ef4444',
          earth: '#10b981',
          air: '#f59e0b',
          water: '#3b82f6',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'magical-glow': 'magical-glow 2s ease-in-out infinite alternate',
        'twinkle-star': 'twinkle-star 1.5s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
      },
      keyframes: {
        'magical-glow': {
          '0%': { boxShadow: '0 0 10px rgba(0, 242, 255, 0.2), 0 0 20px rgba(255, 0, 255, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 242, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.6)' },
        },
        'twinkle-star': {
          '0%': { transform: 'scale(0.8)', opacity: '0.4' },
          '100%': { transform: 'scale(1.2)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
