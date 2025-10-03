/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--background-color)',
        'bg-secondary': 'var(--card-background-color)',
        'text-primary': 'var(--primary-text-color)',
        'text-secondary': 'var(--secondary-text-color)',
        'border-color': 'var(--border-color)',
        'accent': 'var(--accent-color)',
      },
    },
  },
  plugins: [],
}