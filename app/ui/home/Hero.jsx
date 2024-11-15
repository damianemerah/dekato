"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { oswald } from "@/style/font";
import { useSearchStore } from "@/store/store";

const slides = [
  {
    background: `bg-[url('/assets/herobg.avif')]`,
    title: "SUMMER SALE",
    subTitle: "Get 30% OFF On all dresses",
    link: "#",
    linkText: "SHOP NOW",
  },
  {
    background: `bg-[url('/assets/herobg.avif')]`,
    title: "Discover Latest Collection",
    subTitle: "Stylish and trendy women's wear.",
    link: "#",
    linkText: "SHOP NOW",
  },
  {
    background: `bg-[url('/assets/herobg.avif')]`,
    title: "Discover Latest Collection",
    subTitle: "Stylish and trendy women's wear.",
    link: "#",
    linkText: "SHOP NOW",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeDropdown = useSearchStore((state) => state.activeDropdown);
  const setActiveDropdown = useSearchStore((state) => state.setActiveDropdown);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      className={`${oswald.className}`}
      onClick={() => (activeDropdown ? setActiveDropdown(false) : null)}
    >
      <div className="relative">
        <div className="min-h-[500px]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } ${slide.background} h-full w-full bg-cover bg-center bg-no-repeat bg-origin-content`}
            >
              <div
                className={`flex min-h-[500px] items-end justify-start px-4 py-8 sm:px-8 sm:py-12 md:flex-row md:px-16 md:py-16`}
              >
                <div className="heading_d relative m-4 mb-8 flex shrink grow-0 basis-1/3 flex-col justify-center before:top-[-2rem] after:top-[-2rem] sm:basis-1/2 md:m-8 md:mb-0 md:mr-4">
                  <h1
                    className={`mb-6 flex flex-col gap-2 font-bold leading-none ${slide.color} relative z-10 text-6xl text-white md:mb-10 lg:text-7xl`}
                  >
                    {slide.title}
                    <span className="block text-4xl sm:hidden md:hidden">
                      {slide.subTitle}
                    </span>
                    <span className="block text-2xl">{slide.subTitle}</span>
                  </h1>
                  <Link
                    href={slide.link}
                    className={`relative z-10 mt-10 self-start bg-white px-4 py-1 text-sm font-medium text-primary hover:no-underline sm:px-6 sm:py-2 md:px-8 md:text-base`}
                  >
                    {slide.linkText}
                  </Link>
                </div>
                {/* <div className="relative flex h-64 w-full flex-1 justify-center sm:h-80 md:h-96">
                  <div className="block w-1/2">
                    <Image
                      alt="Hero image 1"
                      className="max-h-full object-cover"
                      style={{
                        boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)",
                      }}
                      loading="eager"
                      src={image2}
                      width={300}
                      height={400}
                    />
                  </div>
                  <div className="block w-1/2 -translate-x-6 scale-110 transform sm:-translate-x-8 md:-translate-x-10">
                    <Image
                      alt="Hero image 2"
                      className="max-h-full object-cover"
                      style={{
                        boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.25)",
                      }}
                      loading="eager"
                      src={image3}
                      width={300}
                      height={400}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 right-0 z-10 mb-2 mr-2 flex justify-center gap-1 sm:mb-4 sm:mr-4">
          <button
            onClick={prevSlide}
            className="flex h-6 w-6 items-center justify-center bg-primary text-white sm:h-8 sm:w-8 md:h-10 md:w-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="12px"
              viewBox="0 0 24 24"
              width="12px"
              fill="white"
              className="sm:h-4 sm:w-4 md:h-5 md:w-5"
            >
              <path d="M15.41 16.58L10.83 12l4.58-4.58L14 6l-6 6 6 6z" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="flex h-6 w-6 items-center justify-center bg-primary text-white sm:h-8 sm:w-8 md:h-10 md:w-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="12px"
              viewBox="0 0 24 24"
              width="12px"
              fill="white"
              className="sm:h-4 sm:w-4 md:h-5 md:w-5"
            >
              <path d="M8.59 16.58L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
          </button>
        </div>

        <div className="absolute bottom-0 left-0 z-10 mb-2 ml-2 flex items-center justify-center sm:mb-4 sm:ml-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`mx-1 h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
                index === currentSlide ? "bg-primary" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
