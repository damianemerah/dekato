import Link from "next/link";
import { oswald } from "@/style/font";
import React from "react";

const Logo = () => {
  return (
    <p className={`text-2xl lowercase ${oswald.className}`}>dekato-outfit</p>
  );
};

export default Logo;
