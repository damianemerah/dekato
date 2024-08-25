import { roboto } from "@/font";
import Provider from "@/app/ui/Provider";
import LayoutWrapper from "../ui/layout-wrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "@/style/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${roboto.className} antialiased`}>
          <ToastContainer position="top-center" />
          <LayoutWrapper>{children}</LayoutWrapper>
        </body>
      </Provider>
    </html>
  );
}
