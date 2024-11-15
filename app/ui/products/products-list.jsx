"use client";
import { oswald } from "@/style/font";
import { Pagination as AntdPagination } from "antd";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProductCardSkeleton from "@/app/ui/products/product-card-skeleton";

import HeaderOne from "@/app/ui/heading1";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import { Suspense, useMemo } from "react";

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

  return (
    <>
      {banner && banner.length > 0 ? (
        <header className="h-[25vw] max-h-[378px] min-h-[255px] w-full">
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

      <div>
        <h4
          className={`${oswald.className} text-priamry pl-2 text-[13px] font-bold leading-[58px] tracking-widest`}
        >
          {totalCount} ITEMS
        </h4>
        <div className={`flex flex-wrap justify-start bg-white`}>
          {products &&
            products.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                searchParams={searchParams}
              />
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
