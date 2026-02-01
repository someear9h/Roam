/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        roam: {
          navy: '#0B1121',   // The dark text color from "Roam"
          teal: '#00897B',   // The teal color from the Globe
          gold: '#FFB300',   // The gold color from the Flight Path
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 17, 33, 0.08)',
      }
    },
  },
  plugins: [],
}