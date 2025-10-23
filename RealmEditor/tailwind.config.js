/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#1e1e1e',
        'card': '#252526',
        'border': '#2d2d2d',
        'primary': '#007acc',
        'muted-foreground': '#858585',
        'accent': '#37373d',
        'primary-foreground': '#ffffff',
        'secondary': '#3c3c3c',
        'secondary-foreground': '#ffffff',
        'destructive': '#f44747',
      },
    },
  },
  plugins: [],
}