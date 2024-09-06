import { roboto } from "@/font";
import Provider from "@/app/ui/Provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import "@/style/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AntdRegistry>
        <Provider>
          <body className={`${roboto.className} antialiased`}>{children}</body>
        </Provider>
      </AntdRegistry>
    </html>
  );
}
