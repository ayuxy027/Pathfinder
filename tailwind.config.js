/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        'proj': 'linear-gradient(to right, #0d9488, #06b6d4)', // Teal-green gradient
        'proj-hover': 'linear-gradient(to right, #0a6f6f, #0ea5e5)', // Slightly darker gradient for hover
      },
    },
  },
  variants: {
    extend: {
      backgroundImage: ['hover'],
    },
  },
  plugins: [],
};