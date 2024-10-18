"use client";
import { lazy, useEffect, useState } from "react";
import { useSidebarStore } from "@/store/store";
import Filter from "@/app/ui/products/filter";
import HeaderOne from "@/app/ui/heading1";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { oswald } from "@/style/font";
import { Pagination as AntdPagination } from "antd";
import { useRouter } from "next/navigation";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Dynamically import ProductCard (simulating async behavior)
const ProductCard = lazy(() => import("./product-card"));

const ProductList = ({
  products,
  cat,
  searchParams,
  banner,
  totalCount,
  currentPage,
  limit,
}) => {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const router = useRouter();

  const currentCategory =
    cat.slice(-1)[0].toLowerCase() === "search"
      ? `${products.length} results for ${searchParams.q}`
      : cat.slice(-1)[0];

  const handlePageChange = (page) => {
    const newSearchParams = { ...searchParams, page: page.toString() };
    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`/${cat}?${queryString}`);
  };

  return (
    <>
      {banner && banner.length > 0 ? (
        <div className="h-[25vw] max-h-[378px] min-h-[255px] w-full">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="h-full w-full"
          >
            {banner.map((image, index) => (
              <SwiperSlide key={index} className="h-full w-full">
                <div className="relative h-full w-full object-cover">
                  <Image
                    src={image}
                    alt={`Banner ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="h-full w-full"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center bg-gray-100 py-14 uppercase">
          <HeaderOne>{currentCategory}</HeaderOne>
        </div>
      )}
      <Filter cat={cat} searchParams={searchParams} />

      <div>
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
