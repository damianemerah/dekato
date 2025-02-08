"use client";

import React, { useState, useEffect } from "react";
import {
  CheckOutlined,
  GiftOutlined,
  TagOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { formatToNaira } from "@/utils/getFunc";
import { usePathname } from "next/navigation";
import Link from "next/link";

const PromoBar = () => {
  const pathname = usePathname();
  const [currentPromo, setCurrentPromo] = useState(0);

  const promos = [
    {
      icon: <GiftOutlined className="font-bold" />,
      text: (
        <p className="text-primary">
          <span className="font-bold">Free shipping</span> on all orders over{" "}
          {formatToNaira(150000)}
        </p>
      ),
    },

    {
      icon: <TagOutlined className="font-bold" />,
      text: (
        <p className="text-primary">
          <span className="font-bold">20% Student Discount</span> with valid ID
        </p>
      ),
    },
    {
      icon: <ThunderboltOutlined className="font-bold" />,
      text: (
        <p className="text-primary">
          <span className="font-bold">Flash Sale!</span> Up to 50% off selected
          items
        </p>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promos.length]);

  if (pathname.includes("/admin") || pathname.includes("/account")) return null;

  return (
    <div
      className={`font-oswald ${pathname.startsWith("/product/") ? "sticky top-0 z-[20]" : ""} `}
    >
      <div className="hidden h-10 gap-16 md:flex md:items-center md:justify-center md:bg-white md:px-8">
        {promos.map(({ icon, text }, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 text-[13px] tracking-wide"
          >
            {icon}
            {text}
          </div>
        ))}
      </div>
      <div className="md:hidden">
        <div className="flex h-10 items-center justify-center space-x-2 bg-white text-[13px] font-medium leading-10 tracking-wide">
          {promos[currentPromo].icon}
          {promos[currentPromo].text}
        </div>
      </div>
      {pathname === "/" && (
        <nav>
          <ul className="flex items-center justify-center gap-8 border-t border-t-primary/10 bg-white px-8 py-3.5 font-oswald text-sm font-semibold uppercase sm:hidden">
            <li>
              <Link href="/shop/men">Shop men</Link>
            </li>
            <li>
              <Link href="/shop/women">Shop women</Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default PromoBar;
