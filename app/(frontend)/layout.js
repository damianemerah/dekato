import { roboto } from "@/style/font";
import Provider from "@/app/ui/Provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "@/style/globals.css";
import LayoutWrapper from "@/app/ui/layout-wrapper";
import SidebarServer from "@/app/ui/sidebar/sidebar-server";
import Header from "@/app/ui/header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AntdRegistry>
        <Provider>
          <body className={`${roboto.className} min-h-screen antialiased`}>
            <Header />
            <div className="relative flex w-full">
              <div className="sticky top-16 z-30 h-screen overflow-y-auto">
                <SidebarServer />
              </div>
              <div className="flex-1 overflow-x-hidden md:w-full md:shrink-0">
                <LayoutWrapper>{children}</LayoutWrapper>
              </div>
            </div>
          </body>
        </Provider>
      </AntdRegistry>
    </html>
  );
}
