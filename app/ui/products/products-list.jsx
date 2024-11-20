"use client";
import { oswald } from "@/style/font";
import { Pagination as AntdPagination } from "antd";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProductCardSkeleton from "@/app/ui/products/product-card-skeleton";
import HeaderOne from "@/app/ui/heading1";
import Image from "next/image";
import { Suspense, useMemo, useState, useCallback } from "react";

const ProductHeader = dynamic(
  () => import("@/app/ui/products/product-header"),
  {
    loading: () => (
      <div className="sticky top-0 z-10 mb-10 bg-gray-100">
        <div className="flex h-14 w-full items-center justify-between px-8 shadow-md">
          <div className="h-4 w-full animate-pulse bg-gray-300"></div>
        </div>
      </div>
    ),
    ssr: false,
  },
);

const ProductCard = dynamic(() => import("./product-card"), {
  loading: () => <ProductCardSkeleton />,
  ssr: false,
});

const ProductList = ({
  products,
  cat,
  searchParams,
  banner,
  totalCount,
  currentPage,
  limit,
}) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handlePageChange = (page) => {
    const newSearchParams = { ...searchParams, page: page.toString() };
    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`/${cat}?${queryString}`);
  };

  const currentCategory = useMemo(
    () =>
      cat.slice(-1)[0].toLowerCase() === "search"
        ? `${products.length} results for ${searchParams.q}`
        : cat.slice(-1)[0],
    [cat, products, searchParams],
  );

  const nextSlide = useCallback(() => {
    if (banner) {
      setCurrentSlide((prev) => (prev === banner.length - 1 ? 0 : prev + 1));
    }
  }, [banner]);

  const prevSlide = useCallback(() => {
    if (banner) {
      setCurrentSlide((prev) => (prev === 0 ? banner.length - 1 : prev - 1));
    }
  }, [banner]);

  return (
    <>
      {banner && banner.length > 0 ? (
        <header className="relative h-[25vw] max-h-[378px] min-h-[255px] w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banner.map((image, index) => (
              <div key={index} className="min-w-full">
                <div className="relative h-[25vw] max-h-[378px] min-h-[255px] w-full">
                  <Image
                    src={image}
                    alt={`Banner ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="h-full w-full"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
            aria-label="Previous slide"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
            aria-label="Next slide"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banner.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 w-2 rounded-full ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </header>
      ) : (
        <header className="flex w-full items-center justify-center bg-gray-100 px-20 pb-4 pt-8 uppercase">
          <Suspense
            fallback={
              <div className="h-8 w-24 animate-pulse bg-gray-300"></div>
            }
          >
            <HeaderOne>{currentCategory}</HeaderOne>
          </Suspense>
        </header>
      )}
      <div className="sticky top-24 z-[25]">
        <ProductHeader cat={cat} searchParams={searchParams} />
      </div>

      <div className="px-3">
        <h4
          className={`${oswald.className} text-priamry pl-2 text-[13px] font-bold leading-[58px] tracking-widest`}
        >
          {totalCount} ITEMS
        </h4>
        <div className={`flex flex-wrap justify-start bg-white`}>
          {products &&
            products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
        {/* page footer */}
        <div className="my-6 flex justify-center">
          <AntdPagination
            current={parseInt(currentPage)}
            total={totalCount}
            pageSize={parseInt(limit)}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default ProductList;
