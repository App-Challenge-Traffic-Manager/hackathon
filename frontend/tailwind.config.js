/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        rajdhani: ["Rajdhani", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],

  daisyui: {
    styled: true,
    themes: [
      {
        mytheme: {
          primary: "#00C2DE",
          secondary: "#BED733",
          accent: "#E60078",
          neutral: "#202F39",
          "base-100": "#F2F5F8",
          "base-200": "#112431",
          "base-300": "#111D25",
          info: "#009DE0",
          "info-focus": "#E60078",
          success: "#36D399",
          warning: "#FBBD23",
          error: "#F87272",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
};
