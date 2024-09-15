/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fire: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 85, 0, 0.7), 0 0 30px rgba(255, 140, 0, 0.7)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 140, 0, 1), 0 0 40px rgba(255, 69, 0, 1)' },
        },
      },
      animation: {
        fire: 'fire 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}