/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D97706',
        secondary: '#059669',
        accent: '#F59E0B',
      },
      borderRadius: {
        card: '0.75rem',
        btn: '0.5rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
