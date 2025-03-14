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
        // primary: "#303030",
        primary: "#212529",
        primaryDark: "#1a1a1a",
        secondary: "#00385f",
        // secondary: "#0e7490",
        // grayBg: "#f6f6f6",
        grayBg: "#F0F2F2",
        grayText: "#828282",
        grayOutline: "#C4C4C4",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        shadowSm:
          "0 0 1px rgba(25, 28, 29, 0.1), 0 1px 2px rgba(25, 28, 29, 0.1), 0 1px 3px rgba(25, 28, 29, 0.1)",
        shadowBig:
          "0 0 4px rgba(25, 28, 29, 0.1), 0 4px 12px rgba(25, 28, 29, 0.1), 4px 4px 16px rgba(240, 242, 242, 0.1), -4px 4px 16px rgba(130, 130, 130, 0.1), -4px -4px 16px rgba(196, 196, 196, 0.1), 4px -4px 16px rgba(25, 28, 29, 0.1);",
      },
      gridTemplateColumns: {
        variant: "2rem 1fr minmax(1.75rem, min-content)",
        14: "repeat(14, minmax(0, 1fr))",
      },
      fontFamily: {
        oswald: ["var(--font-oswald, Oswald)", "sans-serif"],
        roboto: ["var(--font-roboto, Roboto)", "sans-serif"],
      },
      fontSize: {
        xxs: "10px",
      },
      transitionProperty: {
        height: "height",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateY(0)" },
          "25%, 75%": { transform: "translateY(-5px)" },
          "50%": { transform: "translateY(5px)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
