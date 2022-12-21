/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "expensr-blue": "#0284c7",
      },
      minWidth: {
        xs: "20rem;",
        sm: "24rem;",
        md: "28rem;",
        lg: "32rem;",
        xl: "36rem;",
        "2xl": "42rem;",
        "3xl": "48rem;",
      },
      height: {
        160: "40rem",
        140: "35rem",
        120: "30rem",
        100: "25rem",
      },
      minHeight: {
        20: "5rem",
      },
      spacing: {
        100: "400px",
      },
      keyframes: {
        slideInBottom: {
          "0%": {
            transform: "translateY(800px)",
            "animation-timing-function": "ease-in",
          },
          "60%": {
            transform: "translateY(-30px)",
            "animation-timing-function": "ease-in",
          },
          "80%": {
            transform: "translateY(-10px)",
            "animation-timing-function": "ease-out",
          },
          "100%": {
            transform: "translateY(0)",
            "animation-timing-function": "ease-in",
          },
        },
        slideOutBottom: {
          "0%": {
            transform: "translateY(1000px)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
        fadeOut: {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0,
          },
        },
      },
      animation: {
        "slide-in-bottom": "fadeIn 0.3s, slideInBottom 0.4s linear",
        "fade-in": "fadeIn 0.4s",
        "fade-out": "fadeOut 0.35s",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
  daisyui: {
    themes: ["cupcake"],
  },
};
