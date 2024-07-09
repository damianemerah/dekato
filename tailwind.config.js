/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./style/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#191C1D",
        grayBg: "#F0F2F2",
        grayText: "#828282",
        grayOutline: "#C4C4C4",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        variant: "2rem 1fr minmax(1.75rem, min-content)",
        14: "repeat(14, minmax(0, 1fr))",
      },
      fontFamily: {
        oswald: "var(--font-oswald)",
        roboto: "var(--font-roboto)",
      },
    },
  },
  plugins: [],
};
