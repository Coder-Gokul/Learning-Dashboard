/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
   colors:{
    primary: '#ff6347',
    secondary: 'white',
   }
    },
  },
  plugins: [],
  corePlugins:{
    preflight: false,
  },
}

