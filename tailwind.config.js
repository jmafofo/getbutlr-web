/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    extend: {
      height: {
        screen: '100dvh',
      }
    },
    plugins: [require('@tailwindcss/typography')],
  }
  