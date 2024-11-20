"use client";

import { memo } from "react";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/store";
import useIsBelowThreshold from "@/app/hooks/useIsBelowThreshold";
import Footer from "@/app/ui/footer";

const LayoutWrapper = ({ children }) => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const lgScreenSidebar = useSidebarStore((state) => state.lgScreenSidebar);
  const isBelowThreshold = useIsBelowThreshold();
  const pathname = usePathname();

  return (
    <main
      className={`${
        isSidebarOpen &&
        !pathname.startsWith("/admin") &&
        (lgScreenSidebar || isBelowThreshold)
          ? "w-full [@media(min-width:1250px)]:w-[calc(100vw-250px)]"
          : "w-full"
      } relative min-h-screen transition-[width] duration-300 ease-in-out`}
    >
      {children}
      {!pathname.startsWith("/admin") && <Footer />}
    </main>
  );
};

export default memo(LayoutWrapper);
