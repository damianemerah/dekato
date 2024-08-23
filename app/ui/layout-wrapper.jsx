"use client";
import React, { useEffect, useState } from "react";
import Header from "@/app/ui/Header";
import PromoBar from "@/app/ui/promo-bar";
import Sidebar from "@/app/ui/sidebar";
import Footer from "@/app/ui/footer";
import { useSidebarStore } from "@/store/store";

const LayoutWrapper = ({ children }) => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1250);
    };

    handleResize(); // Set the initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Header />
      <div className="flex justify-end">
        <Sidebar />
        <div
          className={`pt-[60px] transition-all duration-300 ease-in-out ${isSidebarOpen && !isMobile ? "w-[calc(100%-250px)]" : "w-[100%]"}`}
        >
          <PromoBar />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LayoutWrapper;
