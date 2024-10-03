"use client";
import { lazy } from "react";
import { useSidebarStore } from "@/store/store";
import Filter from "@/app/ui/products/filter";
import HeaderOne from "@/app/ui/heading1";

// Dynamically import ProductCard (simulating async behavior)
const ProductCard = lazy(() => import("./product-card"));

const ProductsList = ({ products, cat, searchParams }) => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const currentCategory =
    cat.slice(-1)[0].toLowerCase() === "search"
      ? `${products.length} results for ${searchParams.q}`
      : cat.slice(-1)[0];
  return (
    <>
      <div className="flex w-full items-center justify-center bg-gray-100 py-14 uppercase">
        <HeaderOne>{currentCategory}</HeaderOne>
      </div>
      <Filter cat={cat} searchParams={searchParams} />
      <div
        className={`${isSidebarOpen ? "w-[calc(100vw-250px)]" : "w-full"} pl-5 pr-8`}
      >
        <div
          className={`${isSidebarOpen && "overflow-hidden"} flex flex-wrap justify-start bg-white`}
          // className={`${isSidebarOpen && "overflow-hidden"} grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}
        >
          {products &&
            products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
      </div>
    </>
  );
};

export default ProductsList;
