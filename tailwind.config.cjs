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
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
  daisyui: {
    themes: ["night"],
  },
};
