import { Oswald, Inter, Roboto } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  fallbacks: ["sans-serif"],
  variable: "--font-oswald",
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallbacks: ["sans-serif"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  fallbacks: ["sans-serif"],
  variable: "--font-roboto",
  weight: ["300", "400", "500"],
});

export { oswald, inter, roboto };
