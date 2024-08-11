"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import image3 from "@/public/assets/image3.png";
import { oswald } from "@/font";

export default function HomeCategory() {
  const [selectedCategory, setSelectedCategory] = useState("women");

  const categories = {
    women: [
      { name: "Dresses", image: image3 },
      { name: "Tops", image: image3 },
      { name: "Jeans", image: image3 },
      { name: "Shoes", image: image3 },
      // { name: "Accessories", image: image3 },
    ],
    men: [
      { name: "Shirts", image: image3 },
      { name: "Pants", image: image3 },
      { name: "Jackets", image: image3 },
      { name: "Sneakers", image: image3 },
    ],
  };

  return (
    <div className={`mt-4 px-6 py-5 ${oswald.className}`}>
      <div className="ml-2 flex flex-col gap-1">
        <h2 className="text-3xl">Selected Category</h2>
        <div className="mb-6 flex items-center gap-6">
          <p className="text-[13px] font-normal">Filter by:</p>
          <ul className="flex gap-4">
            <li
              className={`${selectedCategory === "women" ? "active__category" : ""} cursor-pointer`}
              onClick={() => setSelectedCategory("women")}
            >
              Women
            </li>
            <li
              className={`${selectedCategory === "men" ? "active__category" : ""} cursor-pointer`}
              onClick={() => setSelectedCategory("men")}
            >
              Men
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between gap-7">
        {categories[selectedCategory].map((category, index) => (
          <Link
            href="#"
            key={index}
            style={{
              background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.5) 50%), url('${category.image.src}')`,
              backgroundSize: "cover",
            }}
            className="m-2 flex min-w-[calc(20%-10px)] flex-1 items-center justify-center bg-[#E9D2FF] text-3xl text-white after:block after:pb-[100%]"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
