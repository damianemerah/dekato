"use client";

import Footer from "@/app/ui/footer";
import { memo } from "react";
import { usePathname } from "next/navigation";
import { SWRConfig } from "swr";
import { useSidebarStore } from "@/store/store";

const LayoutWrapper = ({ children }) => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const pathname = usePathname();

  return (
    <SWRConfig value={{}}>
      <div
        className={`${
          isSidebarOpen &&
          !pathname.startsWith("/admin") &&
          !pathname.startsWith("/account")
            ? "w-[calc(100vw-250px)]"
            : "w-full"
        } relative`}
      >
        {children}
        {!pathname.startsWith("/admin") && <Footer />}
      </div>
    </SWRConfig>
  );
};

export default memo(LayoutWrapper);
