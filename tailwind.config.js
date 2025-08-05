/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'border-glow': 'borderGlow 1.5s linear infinite',
        shimmer: "shimmer 2s ease-in-out infinite",
        slideText: "slideText 8s linear infinite",
        typewriter: 'typewriter 4s steps(40) 1s 1 normal both',
        blink: 'blink 1s step-end infinite',
      },
      keyframes: {
        borderGlow: {
          '0%': { borderColor: 'rgba(255, 165, 0, 0.3)' },
          '50%': { borderColor: 'rgba(255, 255, 255, 0.9)' },
          '100%': { borderColor: 'rgba(255, 165, 0, 0.3)' },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        slideText: {
          "0%": { transform: "translateX(-100%)", opacity: "0.1" },
          "50%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0.1" },
        },
        typewriter: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: '#ff6a00' }, // orange
        },
      },
      colors: {
        primary: '#ff6a00',
        accent: '#8e44ad',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/forms')
  ],
};
