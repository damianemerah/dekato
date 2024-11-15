import { roboto } from "@/style/font";
import Provider from "@/app/ui/Provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "@/style/globals.css";
import LayoutWrapper from "@/app/ui/layout-wrapper";
import SidebarServer from "@/app/ui/sidebar/sidebar-server";
import Header from "@/app/ui/header";
import PromoBar from "@/app/ui/promo-bar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AntdRegistry>
        <Provider>
          <body
            className={`${roboto.className} relative min-h-screen antialiased`}
          >
            <Header />
            <div className="flex w-full">
              <div className="sticky top-14 z-50 h-[calc(100vh-3.5rem)]">
                <SidebarServer />
              </div>
              <div className="flex-1 md:w-full md:shrink-0">
                <div className="sticky top-14 z-[20]">
                  <PromoBar />
                </div>
                <LayoutWrapper>{children}</LayoutWrapper>
              </div>
            </div>
          </body>
        </Provider>
      </AntdRegistry>
    </html>
  );
}
