import { roboto } from "@/font";
import Provider from "@/app/ui/Provider";
import GlobalFetch from "@/app/ui/globalFetch";
import { AntdRegistry } from "@ant-design/nextjs-registry";
// import { StyleProvider } from "@ant-design/cssinjs";
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
        {/* <StyleProvider layer> */}
        <Provider>
          <body className={`${roboto.className} antialiased`}>
            <GlobalFetch />
            {children}
          </body>
        </Provider>
        {/* </StyleProvider> */}
      </AntdRegistry>
    </html>
  );
}
