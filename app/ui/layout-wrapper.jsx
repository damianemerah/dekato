"use client";

import Footer from "@/app/ui/footer";
import { memo } from "react";
import { usePathname } from "next/navigation";
import { SWRConfig } from "swr";
import { useSidebarStore } from "@/store/store";
import useIsBelowThreshold from "@/app/hooks/useIsBelowThreshold";

const LayoutWrapper = ({ children }) => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const lgScreenSidebar = useSidebarStore((state) => state.lgScreenSidebar);
  const isBelowThreshold = useIsBelowThreshold();
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
        } ${!lgScreenSidebar && !isBelowThreshold && "w-full"} relative`}
      >
        {children}
        {!pathname.startsWith("/admin") && <Footer />}
      </div>
    </SWRConfig>
  );
};

export default memo(LayoutWrapper);
