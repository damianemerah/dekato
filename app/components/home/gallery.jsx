'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  { src: '/assets/images/image5.webp', alt: 'Fashion model in urban setting' },
  { src: '/assets/images/image5.webp', alt: 'Close-up of stylish accessories' },
  {
    src: '/assets/images/image5.webp',
    alt: 'Group shot of models in latest collection',
  },
  {
    src: '/assets/images/image5.webp',
    alt: 'Behind the scenes at fashion photoshoot',
  },
  {
    src: '/assets/images/image5.webp',
    alt: 'Runway model showcasing designer outfit',
  },
  {
    src: '/assets/images/image5.webp',
    alt: 'Streetwear fashion in city environment',
  },
  {
    src: '/assets/images/image5.webp',
    alt: 'Detail shot of haute couture dress',
  },
  { src: '/assets/images/image5.webp', alt: 'Detail shot of haute couture' },
  {
    src: '/assets/images/image5.webp',
    alt: 'Runway model showcasing designer outfit',
  },
  {
    src: '/assets/images/image5.webp',
    alt: 'Streetwear fashion in city environment',
  },
  {
    src: '/assets/images/image5.webp',
    alt: 'Detail shot of haute couture dress',
  },
  { src: '/assets/images/image5.webp', alt: 'Detail shot of haute couture' },
];

// Custom hook for dot button functionality
const useDotButton = (api) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const onDotButtonClick = useCallback(
    (index) => {
      if (!api) return;
      api.scrollTo(index);
    },
    [api]
  );

  const onInit = useCallback((api) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    onInit(api);
    onSelect(api);

    api.on('reInit', onInit);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api.off('reInit', onInit);
      api.off('reInit', onSelect);
      api.off('select', onSelect);
    };
  }, [api, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [api, setApi] = useState(null);

  // Use the custom hook for dot button functionality
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  // Track scroll capabilities when api changes
  useEffect(() => {
    if (!api) return;

    const updateScrollButtons = () => {
      // These variables are already tracked in the useDotButton hook implementation
      // No need to create additional state variables
      // The API's canScrollPrev and canScrollNext methods will be called directly
    };

    // Initial update
    updateScrollButtons();

    // Update on carousel events - already handled in useDotButton hook
  }, [api]);

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden bg-primary-foreground px-4 py-12 md:px-8">
      <h2 className="mb-6 w-full text-center font-oswald">
        FOLLOW OUR INSTAGRAM
      </h2>

      <div className="relative w-full max-w-7xl">
        <Carousel
          opts={{
            align: 'start',
            slidesToScroll: 4,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="-ml-0 gap-1">
            {galleryImages.map((image, index) => (
              <CarouselItem
                key={index}
                className="basis-full pl-0 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div
                  className="relative cursor-pointer overflow-hidden pb-[100%]"
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.src || '/placeholder.svg'}
                    fill={true}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    alt={image.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-300 hover:scale-105 hover:opacity-90"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom navigation buttons with responsive positioning */}
          <button
            className={`absolute left-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-none border border-primary/60 bg-white/80 transition-colors sm:h-10 sm:w-10 md:-left-6 lg:-left-12 ${
              api?.canScrollPrev() ? 'hover:bg-white' : 'opacity-50'
            }`}
            onClick={() => api?.scrollPrev()}
            disabled={!api?.canScrollPrev()}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Previous</span>
          </button>

          <button
            className={`absolute right-0 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-none border border-primary/60 bg-white/80 transition-colors sm:h-10 sm:w-10 md:-right-6 lg:-right-12 ${
              api?.canScrollNext() ? 'hover:bg-white' : 'opacity-50'
            }`}
            onClick={() => api?.scrollNext()}
            disabled={!api?.canScrollNext()}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Next</span>
          </button>
        </Carousel>
      </div>

      {/* Pagination dots */}
      <div className="mt-6 flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 rounded-full transition-all ${
              selectedIndex === index ? 'scale-110 bg-black' : 'bg-gray-300'
            }`}
            onClick={() => onDotButtonClick(index)}
            aria-label={`Go to slide group ${index + 1}`}
          />
        ))}
      </div>

      {/* View Gallery Button */}
      <div className="mt-8 flex justify-center">
        <a
          href="#"
          className="inline-block border border-black px-16 py-3 text-center font-medium uppercase tracking-wide transition-colors hover:bg-black hover:text-white"
        >
          VIEW GALLERY
        </a>
      </div>

      {/* Modal for image preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden">
            <Image
              src={selectedImage.src || '/placeholder.svg'}
              width={1200}
              height={900}
              alt={selectedImage.alt}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              priority={true}
            />
            <button
              className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-black shadow-md transition-colors hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              aria-label="Close image preview"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
