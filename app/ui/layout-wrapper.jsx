"use client";

import React, { memo, useState, useEffect } from "react";
import Sidebar from "@/app/ui/sidebar";
import Footer from "@/app/ui/footer";
import { useSidebarStore, useUserStore } from "@/store/store";
import Header from "@/app/ui/header";
import { usePathname } from "next/navigation";

const LayoutWrapper = ({ children }) => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const [isMobile, setIsMobile] = useState(false);
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1250);
    };

    handleResize(); // Set the initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div className="h-16">
        <Header />
      </div>
      <div className="relative w-full">
        {!pathname.startsWith("/admin") && <Sidebar />}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarOpen && !isMobile && !pathname.startsWith("/admin")
              ? "ml-[250px] w-[calc(100%-250px)]"
              : "w-[100%]"
          }`}
        >
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default memo(LayoutWrapper);
