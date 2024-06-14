import { Oswald, Inter } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  fallbacks: ["sans-serif"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallbacks: ["sans-serif"],
  variable: "--font-inter",
});

export { oswald, inter };
