"use client";

import Footer from "@/app/ui/footer";
import { memo } from "react";
import { usePathname } from "next/navigation";
import { SWRConfig } from "swr";

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  return (
    <SWRConfig
      value={{
        refreshInterval: 100000,
        revalidateOnFocus: false,
      }}
    >
      <div className="w-full">
        {children}
        {!pathname.startsWith("/admin") && <Footer />}
      </div>
    </SWRConfig>
  );
};

export default memo(LayoutWrapper);
