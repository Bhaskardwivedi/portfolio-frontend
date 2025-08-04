/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // future-proof for TypeScript support
  ],
  theme: {
    extend: {
      animation: {
        'border-glow': 'borderGlow 1.5s linear infinite',
        shimmer: "shimmer 2s ease-in-out infinite",
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
      },
      colors: {
        primary: '#ff6a00',        // Deep orange
        accent: '#8e44ad',         // Purple-pink blend
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
