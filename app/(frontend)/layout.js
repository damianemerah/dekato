import { roboto } from "@/font";
import Provider from "@/app/ui/Provider";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "@/style/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${roboto.className} antialiased`}>{children}</body>
      </Provider>
    </html>
  );
}
