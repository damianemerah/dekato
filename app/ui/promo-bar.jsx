"use client";

import React from "react";
import { CheckOutlined } from "@ant-design/icons";
import { formatToNaira } from "@/utils/getFunc";
import { usePathname } from "next/navigation";
import { oswald } from "@/style/font";

const PromoBar = () => {
  const pathname = usePathname();
  if (pathname.includes("/admin") || pathname.includes("/account")) return null;

  return (
    <div
      className={`${oswald.className} flex h-10 items-center justify-center space-x-2 bg-white text-[13px] font-medium uppercase leading-10 tracking-wide`}
    >
      <CheckOutlined className="font-bold" />
      <p className="text-primary text-opacity-80">
        <span className="font-bold">Free shipping</span> on all orders over{" "}
        {formatToNaira(150000)}
      </p>
    </div>
  );
};

export default PromoBar;
