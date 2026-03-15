/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        waltonBlue: '#0057B8',
        waltonOrange: '#FF7A00',
      },
    },
  },
  plugins: [],
};
