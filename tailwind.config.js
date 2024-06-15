/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{ts,tsx,js,jsx,}",
    "./components/**/*.{ts,tsx,js,jsx,}",
    "./app/**/*.{ts,tsx,js,jsx,}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray:{
          800: '#1d2939'
        },
        ash:{
          500: '#d3d3d3'
        },
        skinGreen: "#1ABC9C",
        blueText: '#1B4F72',
        greenSuccess: '#4ac237',
        danger:'#d92d20',
   
      },
    },
  },
  plugins: [],
};
