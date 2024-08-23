import React from "react";
import ProductCard from "@/app/ui/product-card";

export default function page() {
  const product = {
    id: 1,
    image: "/assets/image3.png",
    category: "TOP WOMEN",
    name: "Angels malu zip jeans slim black used",
    price: "13900.00",
    discount: 30,
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <ProductCard product={product} />
    </div>
  );
}
