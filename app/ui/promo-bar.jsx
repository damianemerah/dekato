"use client";

import React from "react";
import { CheckOutlined } from "@ant-design/icons";
import { formatToNaira } from "@/utils/getFunc";
import { usePathname } from "next/navigation";

const PromoBar = () => {
  const pathname = usePathname();
  if (pathname.includes("/admin") || pathname.includes("/account")) return null;

  return (
    <div className="flex h-10 items-center justify-center space-x-2 bg-white text-[13px] font-medium uppercase leading-10 tracking-wide">
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="#09090b"
      >
        <path d="M240-160q-50 0-85-35t-35-85H40v-440q0-33 23.5-56.5T120-800h560v160h120l120 160v200h-80q0 50-35 85t-85 35q-50 0-85-35t-35-85H360q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T280-280q0-17-11.5-28.5T240-320q-17 0-28.5 11.5T200-280q0 17 11.5 28.5T240-240ZM120-360h32q17-18 39-29t49-11q27 0 49 11t39 29h272v-360H120v360Zm600 120q17 0 28.5-11.5T760-280q0-17-11.5-28.5T720-320q-17 0-28.5 11.5T680-280q0 17 11.5 28.5T720-240Zm-40-200h170l-90-120h-80v120ZM360-540Z" />
      </svg> */}
      <CheckOutlined className="font-bold" />
      <p className="text-primary text-opacity-80">
        <span className="font-bold">Free shipping</span> on all orders over{" "}
        {formatToNaira(150000)}
      </p>
    </div>
  );
};

export default PromoBar;
