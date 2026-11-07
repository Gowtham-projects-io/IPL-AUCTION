/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fjord: {
          950: "#041113",
          900: "#071C20", // Deep Fjord main bg
          800: "#0B262B",
          700: "#102D32", // Ocean Teal card/panel
          600: "#153A41",
        },
        teal: {
          deep: "#0B2327",
          panel: "#102D32",
          card: "#13363C",
          border: "#1C4850",
          hover: "#184148",
        },
        mint: {
          glacier: "#76DCC5", // Glacier Mint primary action
          hover: "#5EC9B0",
          ice: "#B9F5E5",     // Ice Mint highlight
          glow: "rgba(118, 220, 197, 0.25)",
        },
        silver: {
          soft: "#DCE8E8",    // Soft Silver text
          light: "#F0F7F7",
        },
        mist: {
          grey: "#8BA8AA",    // Mist Grey secondary label
          dark: "#5E7779",
        },
        gold: {
          sold: "#FFD700",
          fanfare: "#F59E0B",
          glow: "rgba(255, 215, 0, 0.35)",
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Rajdhani', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'timer-tick': 'timerTick 1s linear infinite',
        'gold-shimmer': 'goldShimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(118, 220, 197, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(118, 220, 197, 0.5)' },
        },
        goldShimmer: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}

