'use client';
import { Pagination as AntdPagination } from 'antd';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProductCardSkeleton from '@/app/components/products/product-card-skeleton';
import HeaderOne from '@/app/components/heading1';
import Image from 'next/image';
import { Suspense, useMemo, useState, useCallback, useEffect } from 'react';
import { useUserStore } from '@/app/store/store';
import { trackView } from '@/app/utils/tracking';
import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';

const MAX_TRACK_TIME = 5000;

const ProductHeader = dynamic(
  () => import('@/app/components/products/product-header'),
  {
    loading: () => (
      <div className="sticky top-0 z-10 mb-10 bg-gray-100">
        <div className="flex h-14 w-full items-center justify-between px-8 shadow-md">
          <div className="h-4 w-full animate-pulse bg-gray-300"></div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

const ProductCard = dynamic(() => import('./product-card'), {
  loading: () => <ProductCardSkeleton />,
  ssr: false,
});

const ProductList = ({
  products,
  cat,
  searchParams,
  banner,
  totalCount,
  currentPage,
  limit,
}) => {
  const router = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trackedProducts, setTrackedProducts] = useState(new Set());
  const [viewStartTimes, setViewStartTimes] = useState({});
  const [viewDurationTotals, setViewDurationTotals] = useState({});
  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  // Track product views in batches
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const productsToTrack = new Set();

        entries.forEach((entry) => {
          const productId = entry.target.dataset.productId;

          if (entry.isIntersecting) {
            // Start tracking view time when product becomes visible
            if (!viewStartTimes[productId]) {
              setViewStartTimes((prev) => ({
                ...prev,
                [productId]: Date.now(),
              }));
            }
          } else {
            // Product is no longer visible
            if (viewStartTimes[productId]) {
              const viewDuration = Date.now() - viewStartTimes[productId];

              // Add current duration to total
              setViewDurationTotals((prev) => ({
                ...prev,
                [productId]: (prev[productId] || 0) + viewDuration,
              }));

              // Check if cumulative time meets threshold
              if (
                (viewDurationTotals[productId] || 0) + viewDuration >=
                  MAX_TRACK_TIME &&
                !trackedProducts.has(productId)
              ) {
                productsToTrack.add(productId);
              }

              // Reset start time but keep cumulative total
              setViewStartTimes((prev) => {
                const newTimes = { ...prev };
                delete newTimes[productId];
                return newTimes;
              });
            }
          }
        });

        // Directly call trackView for each product, handle async without queue
        if (productsToTrack.size > 0) {
          const trackingPromises = [...productsToTrack].map(
            async (productId) => {
              try {
                await trackView(userId, productId);
                // Update state immediately after successful tracking for this product
                setTrackedProducts((prev) => new Set(prev).add(productId));
              } catch (error) {
                console.error(
                  `Error tracking view for product ${productId}:`,
                  error
                );
              }
            }
          );
          // Optional: Wait for all tracking calls to settle if needed, though usually not necessary
          // await Promise.allSettled(trackingPromises);
        }
      },
      {
        threshold: 0.5, // Product is considered visible when 50% in view
        rootMargin: '0px 0px 100px 0px', // Add margin to start loading earlier
      }
    );

    // Observe all product cards
    const productCards = document.querySelectorAll('[data-product-id]');
    productCards.forEach((card) => observer.observe(card));

    return () => {
      productCards.forEach((card) => observer.unobserve(card));
    };
  }, [
    products?.length,
    trackedProducts,
    viewStartTimes,
    userId,
    viewDurationTotals,
  ]);

  const handlePageChange = useCallback(
    (page) => {
      // Create a new URLSearchParams object from the current searchParams
      const currentParams = new URLSearchParams(
        typeof searchParams === 'object'
          ? Object.entries(searchParams).reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {})
          : searchParams
      );

      // Set the new page value
      currentParams.set('page', page.toString());

      // Build the new query string
      const queryString = currentParams.toString();

      // Push the new route with the updated query string
      router.push(`/shop/${cat.join('/')}?${queryString}`);

      // Reset tracked products when page changes
      setTrackedProducts(new Set());
    },
    [searchParams, router, cat]
  );

  const currentCategory = useMemo(
    () =>
      cat.slice(-1)[0].toLowerCase() === 'search'
        ? `${products.length} results for ${searchParams.q}`
        : cat.slice(-1)[0],
    [cat, products, searchParams]
  );

  const nextSlide = useCallback(() => {
    if (banner) {
      setCurrentSlide((prev) => (prev === banner.length - 1 ? 0 : prev + 1));
    }
  }, [banner]);

  const prevSlide = useCallback(() => {
    if (banner) {
      setCurrentSlide((prev) => (prev === 0 ? banner.length - 1 : prev - 1));
    }
  }, [banner]);

  return (
    <div className="flex min-h-screen flex-col">
      {banner && banner.length > 0 ? (
        <header className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banner.map((image, index) => (
              <div
                key={index}
                className="relative h-[20vw] max-h-[378px] min-h-[210px] w-full"
              >
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`Banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  quality={90}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            ))}
          </div>

          {banner.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary/30 text-base text-white hover:bg-primary/50"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-primary/30 text-base text-white hover:bg-primary/50"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                {banner.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 w-2 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/50'}`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </header>
      ) : (
        <header className="flex w-full items-center justify-center bg-gray-100 px-20 py-8 uppercase">
          <Suspense
            fallback={
              <div className="h-8 w-24 animate-pulse bg-gray-300"></div>
            }
          >
            <HeaderOne>{currentCategory}</HeaderOne>
          </Suspense>
        </header>
      )}
      <div className={`sticky top-14 z-[25] block`}>
        <ProductHeader
          cat={cat}
          searchParams={searchParams}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />
      </div>

      <div className="flex-1 px-2 md:px-6 lg:px-8">
        <h4 className="text-priamry text-center font-oswald text-[13px] font-bold leading-[58px] tracking-widest md:text-left">
          {totalCount} ITEMS
        </h4>

        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showDelete={false}
                />
              ))}
            </div>
            <div className="my-6 flex justify-center">
              <AntdPagination
                current={parseInt(currentPage) || 1}
                total={parseInt(totalCount) || 0}
                pageSize={parseInt(limit) || 20}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 py-16 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <PackageSearch className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No products found
            </h3>
            <p className="mb-6 max-w-md text-sm text-gray-500">
              We couldn&apos;t find any products matching your current filters.
              Try adjusting your selection or clearing some filters to see more
              items.
            </p>
            <button
              onClick={() => router.push(`/shop/${cat[0]}`)}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
