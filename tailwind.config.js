const theme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/**/*.{html,js,mjs}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          lightgray: "#F2F2F2",
          indigo: "#74328E",
          black: "#1D1D1B",
          blue: "#53C9FB",
          darkgray: "#707070",
        },
      },
      fontFamily: {
        courier: ["'Courier Prime'", ...theme.fontFamily.mono],
        notosans: ["'Noto Sans TC'", ...theme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
