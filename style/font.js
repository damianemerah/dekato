import { Oswald, Roboto, Open_Sans } from "next/font/google";

const oswald = Oswald({
  family: "Oswald",
  weight: ["200", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const roboto = Roboto({
  family: "Roboto",
  weight: ["300", "400"],
  subsets: ["latin"],
});

const open_sans = Open_Sans({
  family: "Open Sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export { oswald, roboto, open_sans };
