/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',
        secondary: '#f1f3f4',
      },
      minHeight: {
        'calendar-day': '120px'
      },
      zIndex: {
        'modal': '1000',
        'toast': '1100'
      }
    },
  },
  plugins: [],
}