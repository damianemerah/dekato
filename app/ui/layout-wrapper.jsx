"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import { SWRConfig } from "swr";
import { useSidebarStore } from "@/store/store";
import useIsBelowThreshold from "@/app/hooks/useIsBelowThreshold";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/app/ui/footer"), { ssr: false });

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
