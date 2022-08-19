/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      screens: {
        xl: "1240px",
        "2xl": "1240px",
      },
    },
  },
  plugins: [],
};
