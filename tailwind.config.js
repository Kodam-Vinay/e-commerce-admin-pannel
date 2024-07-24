/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js"],
  theme: {
    extend: {
      screens: {
        xs: "300px",
        mxs: "475px",
        sm: "640px",
        md: "768px",
        mdl: "850px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        main_color: "#5046e5",
      },
    },
  },
  plugins: [],
};
