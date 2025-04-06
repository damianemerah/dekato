'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/app/components/products/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const RecommendedProductsClient = ({
  initialProducts = [],
  category,
  name,
}) => {
  // Use the server-provided initial products directly
  const [products] = useState(
    initialProducts.map((p) => ({ id: p.id || p._id, ...p }))
  );
  const [api, setApi] = useState(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Track scroll capabilities when api changes
  useEffect(() => {
    if (!api) return;

    const updateScrollButtons = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    // Initial update
    updateScrollButtons();

    // Update on carousel events
    api.on('select', updateScrollButtons);
    api.on('reInit', updateScrollButtons);

    return () => {
      api.off('select', updateScrollButtons);
      api.off('reInit', updateScrollButtons);
    };
  }, [api]);

  // Return null if no products available
  if (products.length === 0) return null;

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <h2 className={`mb-6 text-left font-oswald`}>YOU MAY ALSO LIKE</h2>
      <Carousel className="w-full" setApi={setApi}>
        <CarouselContent className="-ml-0 gap-4 md:-ml-0">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 pl-0 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:w-[316.5px] xl:basis-auto"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom navigation buttons to match gallery.jsx */}
        <button
          className={`absolute left-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-none border bg-white shadow-none transition-colors sm:h-10 sm:w-10 ${
            canScrollPrev
              ? 'hover:bg-white/90'
              : 'cursor-not-allowed opacity-50'
          }`}
          onClick={() => api?.scrollPrev()}
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Previous</span>
        </button>

        <button
          className={`absolute right-0 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-none border bg-white shadow-none transition-colors sm:h-10 sm:w-10 ${
            canScrollNext
              ? 'hover:bg-white/90'
              : 'cursor-not-allowed opacity-50'
          }`}
          onClick={() => api?.scrollNext()}
          disabled={!canScrollNext}
        >
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Next</span>
        </button>
      </Carousel>
    </div>
  );
};

export default RecommendedProductsClient;
