/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#06080d',
          900: '#0d1117',
          800: '#161b22',
          700: '#21262d',
          600: '#30363d',
        }
      }
    },
  },
  plugins: [],
}
