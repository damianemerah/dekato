"use client";
import React from "react";
import Header from "@/app/ui/Header";
import PromoBar from "@/app/ui/promo-bar";
import Sidebar from "@/app/ui/sidebar";
import Footer from "@/app/ui/footer";
import { useSidebarStore } from "@/store/store";

const LayoutWrapper = ({ children }) => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div
          className={`flex-1 pt-[60px] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-[250px]" : "ml-0"
          }`}
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
