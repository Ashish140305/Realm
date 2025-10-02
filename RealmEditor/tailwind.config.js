/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-dark': '#0d1117',
        'gray-medium': '#161b22',
        'gray-light': '#21262d',
        'gray-text': '#8b949e',
        'gray-text-bright': '#c9d1d9',
        'border-color': '#30363d',
        'accent': 'var(--accent-color)',
      },
    },
  },
  plugins: [],
}