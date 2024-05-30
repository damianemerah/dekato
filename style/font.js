import { Oswald, Inter } from "next/font/google";

const oswald = Oswald({
  subsets: ["latin"],
  fallbacks: ["sans-serif"],
});

const inter = Inter({
  subsets: ["latin"],
  fallbacks: ["sans-serif"],
});

export { oswald, inter };
