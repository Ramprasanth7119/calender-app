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
        // Light mode colors
        light: {
          primary: '#ffffff',
          secondary: '#f8f9fa',
          text: {
            primary: '#1a1a1a',
            secondary: '#666666'
          },
          border: '#e0e0e0',
          hover: '#f1f3f4'
        },
        // Dark mode colors
        dark: {
          primary: '#1f1f1f',
          secondary: '#2d2d2d',
          text: {
            primary: '#e8eaed',
            secondary: '#9aa0a6'
          },
          border: '#404040',
          hover: '#3c4043'
        },
        calendar: {
          bg: 'var(--calendar-bg)',
          cell: 'var(--calendar-cell)',
          text: 'var(--calendar-text)',
          border: 'var(--calendar-border)'
        }
      },
      opacity: {
        '15': '0.15',
        '20': '0.20',
        '30': '0.30',
        '40': '0.40',
      },
      backgroundColor: theme => ({
        ...theme('colors'),
      }),
    },
  },
  plugins: [],
}