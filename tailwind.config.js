/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dashboard-primary': '#009efb',
        'dashboard-secondary': '#007bff'
      }
    },
    fontFamily: {
      Lato: ['Lato, sans-serif']
    }
  },
  plugins: [],
}