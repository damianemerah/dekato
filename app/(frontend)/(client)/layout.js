"use client";

import Header from "@/app/ui/header";
import LayoutWrapper from "@/app/ui/layout-wrapper";
import { SWRDevTools } from "swr-devtools";

export default function RootLayout({ children }) {
  return (
    <div>
      <SWRDevTools>
        <Header />
        <LayoutWrapper>{children}</LayoutWrapper>
      </SWRDevTools>
    </div>
  );
}
