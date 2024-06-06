/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        'xs': '550px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/container-queries')
  ],
}

