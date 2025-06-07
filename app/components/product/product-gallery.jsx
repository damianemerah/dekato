'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { cn } from '@/app/lib/utils';
import { memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductGallery = memo(function ProductGallery({
  product,
  activeImage,
  resetActiveImage,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0.5, y: 0.5 });
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);
  const [emblaApi, setEmblaApi] = useState(null);

  // If activeImage is set, show it as the main image, but allow navigation
  const isOverride = !!activeImage;

  // Helper: find the index of the activeImage in product.image
  const activeImageIndex = activeImage
    ? product.image.findIndex((img) => img === activeImage)
    : -1;

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

  // Modified thumbnail click: if activeImage is set, reset and go to that index
  const handleThumbnailClick = useCallback(
    (index) => {
      if (isOverride) {
        resetActiveImage();
        setActiveIndex(index);
        if (emblaApi) emblaApi.scrollTo(index);
      } else {
        setIsZoomed(false); // Reset zoom when changing image
        setActiveIndex(index);
        if (emblaApi) emblaApi.scrollTo(index);
      }
    },
    [emblaApi, isOverride, resetActiveImage]
  );

  // Modified navigation: if activeImage is set, reset and go to next/prev
  const handlePrev = useCallback(() => {
    if (isOverride) {
      resetActiveImage();
      // Go to previous image from variant image index if possible
      const prevIndex = activeImageIndex > 0 ? activeImageIndex - 1 : 0;
      setActiveIndex(prevIndex);
      if (emblaApi) emblaApi.scrollTo(prevIndex);
    } else {
      setActiveIndex((prev) => Math.max(0, prev - 1));
      if (emblaApi) emblaApi.scrollPrev();
    }
  }, [isOverride, resetActiveImage, activeImageIndex, emblaApi]);

  const handleNext = useCallback(() => {
    if (isOverride) {
      resetActiveImage();
      // Go to next image from variant image index if possible
      const nextIndex =
        activeImageIndex >= 0 && activeImageIndex < product.image.length - 1
          ? activeImageIndex + 1
          : 0;
      setActiveIndex(nextIndex);
      if (emblaApi) emblaApi.scrollTo(nextIndex);
    } else {
      setActiveIndex((prev) => Math.min(product.image.length - 1, prev + 1));
      if (emblaApi) emblaApi.scrollNext();
    }
  }, [
    isOverride,
    resetActiveImage,
    activeImageIndex,
    emblaApi,
    product.image.length,
  ]);

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

  // Sync carousel with activeIndex when it changes (only if not override)
  useEffect(() => {
    if (emblaApi && !isZoomed && !isOverride) {
      emblaApi.scrollTo(activeIndex);
    }
  }, [activeIndex, emblaApi, isZoomed, isOverride]);

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
        {product.image.length > 1 &&
          product.image.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                'relative h-20 w-16 flex-shrink-0 overflow-hidden border transition-all',
                (isOverride ? activeImageIndex : activeIndex) === index
                  ? 'ring-2 ring-primary ring-offset-1'
                  : 'border-transparent'
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
        {isOverride ? (
          <div
            className={cn(
              'relative aspect-[3/4] max-h-[90vh] w-full overflow-hidden',
              isZoomed && 'isolate'
            )}
            onMouseMove={handleMouseMove}
            onClick={handleImageClick}
            style={{
              cursor: `url("data:image/svg+xml,${encodeURIComponent(
                isZoomed
                  ? '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1.8rem\" height=\"1.8rem\" viewBox=\"0 0 15 15\"><path fill=\"none\" stroke=\"white\" d=\"M4 7.5h7m-3.5 7a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z\"/></svg>'
                  : '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1.8rem\" height=\"1.8rem\" viewBox=\"0 0 15 15\"><path fill=\"none\" stroke=\"white\" d=\"M7.5 4v7M4 7.5h7m-3.5 7a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z\"/></svg>'
              )}") 24 24, auto`,
            }}
          >
            <Image
              src={activeImage}
              alt={product.name + ' - selected variant'}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={100}
              className={cn(
                'object-cover object-center transition-transform duration-200 ease-out',
                isZoomed && 'h-full w-full will-change-transform'
              )}
              style={{
                transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                transform: isZoomed ? 'scale(2)' : 'scale(1)',
              }}
            />
            {isZoomed && (
              <div className="absolute inset-0 z-10 cursor-zoom-out bg-black/10" />
            )}
          </div>
        ) : (
          <Carousel
            ref={carouselRef}
            opts={{
              align: 'start',
              dragFree: !isZoomed,
            }}
            setApi={setEmblaApi}
            onSelect={handleSelect}
            className={cn(
              'w-full',
              isZoomed && 'pointer-events-none'
            )}
            aria-label="Product images"
          >
            <CarouselContent
              className={`${isZoomed ? 'overflow-visible' : undefined}`}
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
                      'relative aspect-[3/4] max-h-[90vh] w-full overflow-hidden',
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
                        isZoomed && 'h-full w-full will-change-transform'
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
          </Carousel>
        )}
        {/* Navigation Buttons: always show */}
        {product.image.length > 0 && (
          <>
            <button
              onClick={handlePrev}
              className={`absolute left-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-none border bg-white shadow-none transition-colors sm:h-10 sm:w-10 ${
                !isZoomed &&
                (!isOverride ? emblaApi?.canScrollPrev() : activeImageIndex > 0)
                  ? 'hover:bg-white/90'
                  : 'cursor-not-allowed opacity-50'
              }`}
              disabled={
                isZoomed ||
                (!isOverride
                  ? !emblaApi?.canScrollPrev()
                  : activeImageIndex <= 0)
              }
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Previous</span>
            </button>

            <button
              onClick={handleNext}
              className={`absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-none border bg-white shadow-none transition-colors sm:h-10 sm:w-10 ${
                !isZoomed &&
                (!isOverride
                  ? emblaApi?.canScrollNext()
                  : activeImageIndex < product.image.length - 1)
                  ? 'hover:bg-white/90'
                  : 'cursor-not-allowed opacity-50'
              }`}
              disabled={
                isZoomed ||
                (!isOverride
                  ? !emblaApi?.canScrollNext()
                  : activeImageIndex >= product.image.length - 1)
              }
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Next</span>
            </button>
          </>
        )}
      </div>

      {/* Mobile indicators: always show unless zoomed */}
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
              (isOverride ? activeImageIndex : activeIndex) === index
                ? 'w-4 bg-primary'
                : 'bg-gray-300'
            )}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});

export default ProductGallery;
