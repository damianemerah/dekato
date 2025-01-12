"use client";

import React from "react";
import { CheckOutlined } from "@ant-design/icons";
import { formatToNaira } from "@/utils/getFunc";
import { usePathname } from "next/navigation";
import { oswald } from "@/style/font";
import Link from "next/link";

const PromoBar = () => {
  const pathname = usePathname();
  if (pathname.includes("/admin") || pathname.includes("/account")) return null;

  return (
    <div className={`${pathname === "/" ? "sticky top-14 z-[20]" : ""} `}>
      <div
        className={`${oswald.className} flex h-10 items-center justify-center space-x-2 bg-white text-[13px] font-medium leading-10 tracking-wide`}
      >
        <CheckOutlined className="font-bold" />
        <p className="text-primary">
          <span className="font-bold">Free shipping</span> on all orders over{" "}
          {formatToNaira(150000)}
        </p>
      </div>
      <nav>
        <ul className="flex items-center justify-center gap-8 border-t border-t-primary/10 bg-white px-8 py-3.5 font-oswald text-sm font-semibold uppercase sm:hidden">
          <li>
            <Link href="/men">Shop men</Link>
          </li>
          <li>
            <Link href="/women">Shop women</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default PromoBar;
