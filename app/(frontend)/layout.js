import { roboto } from "@/font";
import Provider from "@/app/ui/Provider";
import GlobalFetch from "@/app/ui/globalFetch";
import { AntdRegistry } from "@ant-design/nextjs-registry";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "@/style/globals.css";
import LayoutWrapper from "@/app/ui/layout-wrapper";
import SidebarServer from "@/app/ui/sidebar-server";
import Header from "@/app/ui/header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AntdRegistry>
        <Provider>
          <body className={`${roboto.className} antialiased`}>
            <GlobalFetch />
            <Header />
            <div className="relative flex w-full">
              <div className="sticky top-16 z-30 h-screen overflow-y-auto">
                <SidebarServer />
              </div>
              <div className="flex-1 overflow-x-hidden">
                <LayoutWrapper>{children}</LayoutWrapper>
              </div>
            </div>
          </body>
        </Provider>
      </AntdRegistry>
    </html>
  );
}
