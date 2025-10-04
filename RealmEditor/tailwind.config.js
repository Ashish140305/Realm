/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': 'var(--background-color)',
        'card-background': 'var(--card-background-color)', // Solid background
        'primary': 'var(--primary-color)',
        'accent': 'var(--accent-color)',
        'text-primary': 'var(--primary-text-color)',
        'text-secondary': 'var(--secondary-text-color)',
        'border-color': 'var(--border-color)',
      },
    },
  },
  plugins: [],
}