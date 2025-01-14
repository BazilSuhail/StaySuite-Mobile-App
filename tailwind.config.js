/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        spin13213: 'spin13213 2s linear infinite', // Custom animation
      },
      keyframes: {
        spin13213: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      width: {
        '50p': '50px', // Custom width
      },
      height: {
        '50p': '50px', // Custom height
      },
      borderWidth: {
        7: '7px', // Custom border width
      },
      borderRadius: {
        '50p': '50%', // Custom border radius
      },
      colors: {
        primary: '#43cec7', // Custom color
      },
    },
  },
  plugins: [],
};
