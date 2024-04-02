/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Poppins', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assests/bg.png')"
      }
    },
  },
  plugins: [],
}

