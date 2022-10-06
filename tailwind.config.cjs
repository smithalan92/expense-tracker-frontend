/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minWidth: {
        xs: "20rem;",
        sm: "24rem;",
        md: "28rem;",
        lg: "32rem;",
        xl: "36rem;",
        "2xl": "42rem;",
        "3xl": "48rem;",
      },
      spacing: {
        100: "400px",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
  daisyui: {
    themes: ["night"],
  },
};
