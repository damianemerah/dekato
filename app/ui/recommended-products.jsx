"use client";
import {} from "react";
import ProductCard from "@/app/ui/product-card";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const RecommendedProducts = () => {
  const breakpoints = {
    480: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 4 },
    // 1275: { slidesPerView: 5 },
  };

  const products = [
    {
      id: 1,
      image: ["/assets/image3.png"],
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "13900.00",
      discount: 30,
      cat: ["men"],
    },
    {
      id: 2,
      image: ["/assets/image2.png"],
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "235.00",
      cat: ["men"],
    },
    {
      id: 3,
      image: ["/assets/image3.png"],
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "90.00",
      cat: ["men"],
    },
    {
      id: 4,
      image: ["/assets/image2.png"],
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "13900.00",
      discount: 30,
      cat: ["men"],
    },
    {
      id: 3,
      image: ["/assets/image3.png"],
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "90.00",
      cat: ["men"],
    },
    {
      id: 4,
      image: ["/assets/image2.png"],
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "13900.00",
      discount: 30,
      cat: ["men"],
    },
    {
      id: 3,
      image: ["/assets/image3.png"],
      category: "TOP WOMEN",
      name: "Angels malu zip jeans slim black used",
      price: "90.00",
      cat: ["men"],
    },
  ];

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
        {products.map((product, index) => (
          <SwiperSlide key={index}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
        {/* Custom Navigation Buttons */}
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
