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
      zIndex: {
        "-1": -1,
      },
      rotate: {
        "-20": "-20deg",
      },
      animation: {
        bouncetop: "bouncetop 1s infinite",
        bouncebottom: "bouncebottom 1s infinite",
      },
      keyframes: {
        bouncetop: {
          "0%, 100%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateY(-10%)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
        bouncebottom: {
          "0%, 100%": {
            transform: "none",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateY(10%)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
        },
      },
    },
  },
  variants: {
    extend: {
      backgroundOpacity: ["responsive", "hover", "focus"],
      animation: ["responsive", "motion-safe", "motion-reduce", "group-hover"],
    },
  },
  plugins: [],
};
