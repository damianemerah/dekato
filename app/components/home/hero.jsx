'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    background: `/assets/images/herobg.avif`,
    title: 'UP TO 40% OFF',
    subTitle: 'BLACK FRIDAY',
    description: 'EARLY ACCESS',
    link: '#',
    linkText: "MEN'S DEALS",
    secondaryLink: '#',
    secondaryLinkText: "WOMEN'S DEALS",
  },
  {
    background: `/assets/images/hero_img1.jpg`,
    title: 'NEW COLLECTION',
    subTitle: 'WINTER 2023',
    description: 'DISCOVER THE LATEST STYLES',
    link: '#',
    linkText: 'SHOP MEN',
    secondaryLink: '#',
    secondaryLinkText: 'SHOP WOMEN',
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
    <section className="relative w-full overflow-hidden bg-black font-oswald">
      <div className="relative h-[60vh] max-h-[800px] min-h-[400px] sm:h-[80vh] sm:min-h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 duration-700 ${
              index === currentSlide
                ? 'opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
          >
            <Image
              src={slide.background}
              alt={`Background for ${slide.title}`}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover object-center opacity-80"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="container relative mx-auto h-full px-4 sm:px-6 lg:px-8">
              <div className="flex h-full max-w-4xl flex-col justify-center">
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1 sm:space-y-2">
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-8xl">
                      {slide.title}
                    </h2>
                    <p className="text-2xl font-bold text-white sm:text-4xl lg:text-6xl">
                      {slide.subTitle}
                    </p>
                    <p className="text-lg text-white sm:text-2xl lg:text-3xl">
                      {slide.description}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-4 sm:gap-4 sm:pt-6">
                    <Link
                      href={slide.link}
                      className="inline-flex h-8 items-center justify-center bg-white px-4 text-xs font-bold transition-colors hover:bg-white/90 sm:h-10 sm:px-8 sm:text-sm"
                    >
                      {slide.linkText}
                    </Link>
                    <Link
                      href={slide.secondaryLink}
                      className="inline-flex h-8 items-center justify-center bg-white px-4 text-xs font-bold transition-colors hover:bg-white/90 sm:h-10 sm:px-8 sm:text-sm"
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

      {/* <div className="absolute bottom-8 right-4 z-10 flex gap-3 sm:right-8 sm:gap-6">
        <button
          onClick={prevSlide}
          className="flex h-8 w-8 items-center justify-center bg-white transition-colors hover:bg-white/90 sm:h-12 sm:w-12"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="flex h-8 w-8 items-center justify-center bg-white transition-colors hover:bg-white/90 sm:h-12 sm:w-12"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
      </div> */}

      <div className="absolute bottom-8 left-4 z-10 flex gap-2 sm:left-8">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 transition-all sm:h-2 ${
              index === currentSlide
                ? 'w-6 bg-white sm:w-8'
                : 'w-1.5 bg-white/50 sm:w-2'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
