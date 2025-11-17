/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.hbs', './src/**/*.js', './src/**/*.html'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#F46752' },
        ink: { DEFAULT: '#363839' },
        sky: { DEFAULT: '#E5F3FE' },
        paper: { DEFAULT: '#F9F5F2' },
        link: { DEFAULT: '#126F85' },
        blueBox: {
          text: '#7CAFDD',
          background: '#E5F3FF',
        },
        tealBox: {
          text: '#126F85',
          background: '#B8D4DA',
        },
        orangeBox: {
          text: '#FFAE68',
          background: '#FFE7D2',
        },
        redBox: {
          text: '#FA5240',
          background: '#FDCBC6',
        },
      },
    },
  },
  plugins: [],
};
