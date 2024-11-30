"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { oswald } from "@/style/font";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    background: `/assets/herobg.avif`,
    title: "UP TO 40% OFF",
    subTitle: "BLACK FRIDAY",
    description: "EARLY ACCESS",
    link: "#",
    linkText: "MEN'S DEALS",
    secondaryLink: "#",
    secondaryLinkText: "WOMEN'S DEALS",
  },
  {
    background: `/assets/herobg.avif`,
    title: "NEW COLLECTION",
    subTitle: "WINTER 2023",
    description: "DISCOVER THE LATEST STYLES",
    link: "#",
    linkText: "SHOP MEN",
    secondaryLink: "#",
    secondaryLinkText: "SHOP WOMEN",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 8000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      className={`${oswald.className} relative w-screen overflow-hidden bg-black`}
    >
      <div className="relative h-[80vh] max-h-[800px] min-h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 duration-700 ${
              index === currentSlide
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <Image
              src={slide.background}
              alt={`Background for ${slide.title}`}
              layout="fill"
              objectFit="cover"
              priority={index === 0}
              className="object-center opacity-80"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="container relative mx-auto h-full px-4 sm:px-6 lg:px-8">
              <div className="flex h-full max-w-4xl flex-col justify-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-6xl font-bold tracking-tight text-white sm:text-8xl">
                      {slide.title}
                    </h2>
                    <p className="text-4xl font-bold text-white sm:text-6xl">
                      {slide.subTitle}
                    </p>
                    <p className="text-2xl text-white sm:text-3xl">
                      {slide.description}
                    </p>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <Link
                      href={slide.link}
                      className="inline-flex h-10 items-center justify-center bg-white px-8 text-sm font-bold transition-colors hover:bg-white/90"
                    >
                      {slide.linkText}
                    </Link>
                    <Link
                      href={slide.secondaryLink}
                      className="inline-flex h-10 items-center justify-center bg-white px-8 text-sm font-bold transition-colors hover:bg-white/90"
                    >
                      {slide.secondaryLinkText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 right-8 z-10 flex gap-6">
        <button
          onClick={prevSlide}
          className="flex h-12 w-12 items-center justify-center bg-white transition-colors hover:bg-white/90"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="flex h-12 w-12 items-center justify-center bg-white transition-colors hover:bg-white/90"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="absolute bottom-8 left-8 z-10 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 transition-all ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
