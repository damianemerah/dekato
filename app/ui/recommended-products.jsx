"use client";
import useSWR from "swr";
import dynamic from "next/dynamic";
import ProductCardSkeleton from "@/app/ui/products/product-card-skeleton";
import { LoadingSpinner } from "./spinner";
import { useRef, useState, useEffect } from "react";

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
    if (containerRef.current) {
      setMaxScroll(
        containerRef.current.scrollWidth - containerRef.current.clientWidth,
      );
    }
  }, [data]);

  const scroll = (direction) => {
    const scrollAmount = 300; // Adjust scroll amount as needed
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(maxScroll, scrollPosition + scrollAmount);

    setScrollPosition(newPosition);
    containerRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  if (error) return <div>Failed to load products...</div>;
  if (isLoading) return <LoadingSpinner />;

  const products = data?.products?.map((p) => ({ id: p._id, ...p })) || [];

  if (products?.length === 0) return <div>No products found.</div>;

  return (
    <div className="relative max-w-[100vw]">
      <div
        ref={containerRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto"
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="min-w-[calc(50%-8px)] md:w-[calc(33.333%-8px)] md:min-w-56 lg:w-[calc(25%-8px)]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={() => scroll("left")}
        disabled={scrollPosition <= 0}
        className={`absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center bg-primary text-white transition-opacity ${
          scrollPosition <= 0 ? "opacity-50" : "opacity-100"
        }`}
        aria-label="Previous products"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 0 24 24"
          width="20px"
          fill="white"
        >
          <path d="M15.41 16.58L10.83 12l4.58-4.58L14 6l-6 6 6 6z" />
        </svg>
      </button>
      <button
        onClick={() => scroll("right")}
        disabled={scrollPosition >= maxScroll}
        className={`absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center bg-primary text-white transition-opacity ${
          scrollPosition >= maxScroll ? "opacity-50" : "opacity-100"
        }`}
        aria-label="Next products"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="20px"
          viewBox="0 0 24 24"
          width="20px"
          fill="white"
        >
          <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
        </svg>
      </button>
    </div>
  );
};

export default RecommendedProducts;
