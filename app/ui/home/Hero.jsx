"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import image2 from "@/public/assets/image2.png";
import image3 from "@/public/assets/image3.png";
import { oswald } from "@/font";
import PromoBar from "@/app/ui/promo-bar";

import "swiper/css/effect-fade";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade, Autoplay } from "swiper/modules";
import { useSearchStore } from "@/store/store";

export default function Hero() {
  const activeDropdown = useSearchStore((state) => state.activeDropdown);
  const setActiveDropdown = useSearchStore((state) => state.setActiveDropdown);
  return (
    <section
      className={`${oswald.className}`}
      onClick={() => (activeDropdown ? setActiveDropdown(false) : null)}
    >
      <PromoBar />
      <Swiper
        modules={[EffectFade, Pagination, Navigation, Autoplay]}
        spaceBetween={30}
        centeredSlides={true}
        effect={"fade"}
        fadeEffect={{ crossFade: true }}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{
          el: ".custom-pagination",
          clickable: true,
          renderBullet: (index, className) =>
            `<span className="${className}"></span>`,
        }}
        className="relative"
      >
        <SwiperSlide className="h-auto bg-[url('/assets/hero_bg.png')] bg-cover bg-center bg-no-repeat">
          <div
            className={`flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 md:flex-row md:px-16 md:py-16`}
          >
            <div className="heading_bd relative mb-8 flex flex-shrink-0 flex-grow-0 basis-full flex-col justify-center p-4 md:mb-0 md:mr-4 md:basis-1/2 md:p-8">
              <h1 className="mb-6 text-3xl font-bold leading-tight text-primary sm:text-4xl md:mb-10 md:text-5xl lg:text-7xl">
                SUMMER SALE: Get 30% OFF On all dresses.
              </h1>
              <Link
                href="#"
                className="self-start border-2 border-primary px-6 py-2 font-medium text-primary hover:no-underline sm:px-8 sm:py-3"
              >
                SHOP NOW
              </Link>
            </div>
            <div className="relative flex h-64 w-full flex-1 justify-center border-dashed sm:h-80 md:h-96">
              <div className="block w-1/2">
                <Image
                  alt="cat"
                  className="max-h-full object-cover"
                  style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
                  loading="lazy"
                  src={image2}
                />
              </div>
              <div className="block w-1/2 -translate-x-10 scale-110 transform">
                <Image
                  alt="cat"
                  className="max-h-full object-cover"
                  style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.25)" }}
                  loading="lazy"
                  src={image3}
                />
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="h-auto bg-[url('/assets/hero_img1.jpg')] bg-cover bg-center bg-no-repeat">
          <div
            className={`flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 md:flex-row md:px-16 md:py-16`}
          >
            <div className="heading_bd relative mb-8 flex flex-shrink-0 flex-grow-0 basis-full flex-col justify-center p-4 md:mb-0 md:mr-4 md:basis-1/2 md:p-8">
              <h1 className="mb-6 text-3xl font-bold leading-tight text-primary sm:text-4xl md:mb-10 md:text-5xl lg:text-7xl">
                Discover the Latest Collection of Women&apos;s Wear.
              </h1>
              <Link
                href="#"
                className="self-start border-2 border-primary px-6 py-2 font-medium text-primary hover:no-underline sm:px-8 sm:py-3"
              >
                SHOP NOW
              </Link>
            </div>
            <div className="relative flex h-64 w-full flex-1 justify-center border-dashed sm:h-80 md:h-96">
              <div className="block w-1/2">
                <Image
                  alt="cat"
                  className="max-h-full object-cover"
                  style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
                  loading="lazy"
                  src={image2}
                />
              </div>
              <div className="block w-1/2 -translate-x-10 scale-110 transform">
                <Image
                  alt="cat"
                  className="max-h-full object-cover"
                  style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.25)" }}
                  loading="lazy"
                  src={image3}
                />
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide className="h-auto bg-[url('/assets/hero_img2.jpg')] bg-cover bg-center bg-no-repeat">
          <div
            className={`flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12 md:flex-row md:px-16 md:py-16`}
          >
            <div className="heading_bd relative mb-8 flex flex-shrink-0 flex-grow-0 basis-full flex-col justify-center p-4 md:mb-0 md:mr-4 md:basis-1/2 md:p-8">
              <h1 className="mb-6 text-3xl font-bold leading-tight text-primary sm:text-4xl md:mb-10 md:text-5xl lg:text-7xl">
                New Arrivals: Fresh Styles for Every Occasion.
              </h1>
              <Link
                href="#"
                className="self-start border-2 border-primary px-6 py-2 font-medium text-primary hover:no-underline sm:px-8 sm:py-3"
              >
                SHOP NOW
              </Link>
            </div>
            <div className="relative flex h-64 w-full flex-1 justify-center border-dashed sm:h-80 md:h-96">
              <div className="block w-1/2">
                <Image
                  alt="cat"
                  className="max-h-full object-cover"
                  style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
                  loading="lazy"
                  src={image2}
                />
              </div>
              <div className="block w-1/2 -translate-x-10 scale-110 transform">
                <Image
                  alt="cat"
                  className="max-h-full object-cover"
                  style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.25)" }}
                  loading="lazy"
                  src={image3}
                />
              </div>
            </div>
          </div>
        </SwiperSlide>

        <div className="absolute bottom-0 right-0 z-10 mb-4 mr-4 flex justify-center gap-1">
          <div className="swiper-button-prev-custom !visible flex h-8 w-8 items-center justify-center bg-primary text-white sm:h-10 sm:w-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 0 24 24"
              width="16px"
              fill="white"
              className="sm:h-5 sm:w-5"
            >
              <path d="M15.41 16.58L10.83 12l4.58-4.58L14 6l-6 6 6 6z" />
            </svg>
          </div>
          <div className="swiper-button-next-custom !visible flex h-8 w-8 items-center justify-center bg-primary text-white sm:h-10 sm:w-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16px"
              viewBox="0 0 24 24"
              width="16px"
              fill="white"
              className="sm:h-5 sm:w-5"
            >
              <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </div>
        </div>

        <div className="custom-pagination absolute bottom-0 left-0 z-10 mb-4 ml-4 flex !w-fit items-center justify-center"></div>
      </Swiper>
    </section>
  );
}
