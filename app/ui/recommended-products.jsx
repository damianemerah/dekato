"use client";
import useSWR from "swr";
import ProductCard from "@/app/ui/product-card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const fetcher = (url) => fetch(url).then((res) => res.json());

const RecommendedProducts = ({ category }) => {
  const { data, error } = useSWR(
    `/api/recommendations?category=${category}&limit=10`,
    fetcher,
  );

  const breakpoints = {
    480: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
    // 1275: { slidesPerView: 5 },
  };

  if (error) return <div>Failed to load products...</div>;
  if (!data) return <div>Loading...</div>;

  const products = data.products || [];

  if (products.length === 0) return <div>No products found.</div>;

  return (
    <>
      <Swiper
        modules={[Navigation]}
        slidesPerView={1}
        spaceBetween={15}
        breakpoints={breakpoints}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        className="relative px-3"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
        {/* Navigation buttons */}
        <div className="swiper-button-prev-custom absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center bg-black text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 0 24 24"
            width="20px"
            fill="white"
          >
            <path d="M15.41 16.58L10.83 12l4.58-4.58L14 6l-6 6 6 6z" />
          </svg>
        </div>
        <div className="swiper-button-next-custom absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center bg-black text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 0 24 24"
            width="20px"
            fill="white"
          >
            <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
        </div>
      </Swiper>
    </>
  );
};

export default RecommendedProducts;
