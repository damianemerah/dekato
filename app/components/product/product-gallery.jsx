'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/app/components/ui/carousel';
import { cn } from '@/app/lib/utils';
import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductGallery = memo(function ProductGallery({ product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0.5, y: 0.5 });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);
  const [emblaApi, setEmblaApi] = useState(null);

  // For desktop: handle zoom on click
  const handleImageClick = useCallback(() => {
    setIsZoomed((prev) => !prev);
  }, []);

  // For desktop: handle mouse move to track zoom position
  const handleMouseMove = useCallback((e) => {
    if (!e.currentTarget) return;

    const { width, height, left, top } =
      e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
    const y = Math.max(0, Math.min(1, (e.clientY - top) / height));

    setZoomPosition({ x, y });
  }, []);

  // Handle thumbnail clicks
  const handleThumbnailClick = useCallback(
    (index) => {
      setIsZoomed(false); // Reset zoom when changing image
      setActiveIndex(index);

      // Directly scroll the carousel if API is available
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  // Handle carousel slide changes
  const handleSelect = useCallback(
    (api) => {
      if (!isZoomed) {
        const currentIndex = api.selectedScrollSnap();
        setActiveIndex(currentIndex);
      }
    },
    [isZoomed]
  );

  // Sync carousel with activeIndex when it changes
  useEffect(() => {
    if (emblaApi && !isZoomed) {
      emblaApi.scrollTo(activeIndex);
    }
  }, [activeIndex, emblaApi, isZoomed]);

  // Manage zoom effects
  useEffect(() => {
    if (emblaApi) {
      if (isZoomed) {
        // Add a class to increase the z-index of the active slide
        const activeSlide = carouselRef.current?.querySelector(
          `[data-carousel-item-index="${activeIndex}"]`
        );
        if (activeSlide) {
          activeSlide.classList.add('z-10');
        }
      } else {
        // Remove z-index class when not zoomed
        const slides = carouselRef.current?.querySelectorAll(
          '[data-carousel-item-index]'
        );
        slides?.forEach((slide) => {
          slide.classList.remove('z-10');
        });
      }
    }
  }, [isZoomed, activeIndex, emblaApi]);

  // For mobile: touch handlers
  const handleTouchStart = useCallback(
    (e) => {
      // Don't handle swipe when zoomed
      if (isZoomed) return;
      setTouchStart(e.touches[0].clientX);
    },
    [isZoomed]
  );

  const handleTouchMove = useCallback(
    (e) => {
      // Don't handle swipe when zoomed
      if (isZoomed) return;
      setTouchEnd(e.touches[0].clientX);
    },
    [isZoomed]
  );

  const handleTouchEnd = useCallback(() => {
    // Don't handle swipe when zoomed
    if (isZoomed || !touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeIndex < product.image.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }

    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  }, [isZoomed, touchStart, touchEnd, activeIndex, product?.image?.length]);

  if (!product?.image || product.image.length === 0) {
    return (
      <div className="flex h-[450px] w-full items-center justify-center bg-gray-100">
        <p className="text-gray-500">No product images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-6">
      {/* Thumbnails Column */}
      <div className="flex flex-row gap-2 overflow-x-auto p-2 md:max-h-[600px] md:w-20 md:flex-col md:gap-3 md:overflow-y-auto">
        {product.image > 1 &&
          product.image.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                'relative h-20 w-16 flex-shrink-0 overflow-hidden border transition-all',
                activeIndex === index
                  ? 'ring-2 ring-primary ring-offset-1'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover object-center"
              />
            </button>
          ))}
      </div>

      {/* Main Image Area */}
      <div className="relative flex-1">
        <Carousel
          ref={carouselRef}
          opts={{
            align: 'start',
            loop: product.image.length > 1,
            dragFree: !isZoomed, // Disable drag when zoomed
          }}
          setApi={setEmblaApi}
          onSelect={handleSelect}
          className={cn(
            'w-full',
            isZoomed && 'pointer-events-none' // Disable carousel navigation when zoomed
          )}
          aria-label="Product images"
        >
          <CarouselContent
            className={isZoomed ? 'overflow-visible' : undefined}
          >
            {product.image.map((image, index) => (
              <CarouselItem
                key={index}
                className={cn(
                  'pl-0',
                  isZoomed && index === activeIndex
                    ? 'overflow-visible'
                    : 'overflow-hidden'
                )}
                data-carousel-item-index={index}
              >
                <div
                  className={cn(
                    'relative aspect-[3/4] w-full overflow-hidden',
                    isZoomed && 'isolate'
                  )}
                  onMouseMove={handleMouseMove}
                  onClick={handleImageClick}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    cursor: `url("data:image/svg+xml,${encodeURIComponent(
                      isZoomed
                        ? '<svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.8rem" viewBox="0 0 15 15"><path fill="none" stroke="white" d="M4 7.5h7m-3.5 7a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"/></svg>'
                        : '<svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.8rem" viewBox="0 0 15 15"><path fill="none" stroke="white" d="M7.5 4v7M4 7.5h7m-3.5 7a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"/></svg>'
                    )}") 24 24, auto`,
                    pointerEvents:
                      isZoomed || index === activeIndex ? 'auto' : 'none',
                  }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={100}
                    className={cn(
                      'object-cover object-center transition-transform duration-200 ease-out',
                      isZoomed &&
                        'h-full max-h-[80vh] w-full will-change-transform'
                    )}
                    style={{
                      transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                      transform:
                        isZoomed && index === activeIndex
                          ? `scale(${isZoomed ? 2 : 1})`
                          : 'scale(1)',
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {product.image.length > 1 && (
            <>
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className={`absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-none border bg-white shadow-none transition-colors sm:h-10 sm:w-10 ${
                  !isZoomed && emblaApi?.canScrollPrev()
                    ? 'hover:bg-white/90'
                    : 'cursor-not-allowed opacity-50'
                }`}
                disabled={isZoomed || !emblaApi?.canScrollPrev()}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Previous</span>
              </button>

              <button
                onClick={() => emblaApi?.scrollNext()}
                className={`absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-none border bg-white shadow-none transition-colors sm:h-10 sm:w-10 ${
                  !isZoomed && emblaApi?.canScrollNext()
                    ? 'hover:bg-white/90'
                    : 'cursor-not-allowed opacity-50'
                }`}
                disabled={isZoomed || !emblaApi?.canScrollNext()}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Next</span>
              </button>
            </>
          )}
        </Carousel>
      </div>

      {/* Mobile indicators */}
      <div
        className={cn(
          'mt-4 flex justify-center gap-2 md:hidden',
          isZoomed && 'hidden' // Hide indicators when zoomed
        )}
      >
        {product.image.map((_, index) => (
          <button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={cn(
              'h-2 w-2 rounded-full transition-all',
              index === activeIndex ? 'w-4 bg-primary' : 'bg-gray-300'
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

export default ProductGallery;
