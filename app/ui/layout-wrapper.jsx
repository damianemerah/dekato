"use client";

import Footer from "@/app/ui/footer";
import { memo } from "react";
import { usePathname } from "next/navigation";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className="w-full">
      {children}
      {!pathname.startsWith("/admin") && <Footer />}
    </div>
  );
};

export default memo(LayoutWrapper);
