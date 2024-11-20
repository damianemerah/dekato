"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCardSkeleton from "@/app/ui/products/product-card-skeleton";
import { LoadingSpinner } from "./spinner";

const ProductCard = dynamic(() => import("@/app/ui/products/product-card"), {
  loading: () => <ProductCardSkeleton />,
  ssr: false,
});

const fetcher = (url) => fetch(url).then((res) => res.json());

const RecommendedProducts = ({ category }) => {
  const { data, error, isLoading } = useSWR(
    `/api/recommendations?category=${category}&limit=10`,
    fetcher,
  );

  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  useEffect(() => {
    const updateMaxScroll = () => {
      if (containerRef.current) {
        setMaxScroll(
          containerRef.current.scrollWidth - containerRef.current.clientWidth,
        );
      }
    };

    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll);

    return () => window.removeEventListener("resize", updateMaxScroll);
  }, [data]);

  const scroll = useCallback(
    (direction) => {
      const scrollAmount = 300;
      const newPosition =
        direction === "left"
          ? Math.max(0, scrollPosition - scrollAmount)
          : Math.min(maxScroll, scrollPosition + scrollAmount);

      setScrollPosition(newPosition);
      containerRef.current?.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    },
    [scrollPosition, maxScroll],
  );

  if (error)
    return (
      <div className="text-center text-red-500">
        Failed to load products. Please try again later.
      </div>
    );
  if (isLoading)
    return (
      <div className="flex justify-center">
        <LoadingSpinner />
      </div>
    );

  const products = data?.products?.map((p) => ({ id: p._id, ...p })) || [];

  if (products.length === 0)
    return (
      <div className="text-center">No products found for this category.</div>
    );
  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-[calc(50%-8px)] flex-shrink-0 md:w-[calc(33.333%-12px)] lg:w-[calc(25%-12px)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("left")}
        disabled={scrollPosition <= 0}
        className={`absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-md transition-opacity hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          scrollPosition <= 0 ? "opacity-50" : "opacity-100"
        }`}
        aria-label="View previous products"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => scroll("right")}
        disabled={scrollPosition >= maxScroll}
        className={`absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-md transition-opacity hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          scrollPosition >= maxScroll ? "opacity-50" : "opacity-100"
        }`}
        aria-label="View more products"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
};

export default RecommendedProducts;
