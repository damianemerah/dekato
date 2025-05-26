'use client';
import { Pagination as AntdPagination } from 'antd';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProductCardSkeleton from '@/app/components/products/product-card-skeleton';
import HeaderOne from '@/app/components/heading1';
import Image from 'next/image';
import {
  Suspense,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useUserStore } from '@/app/store/store';
import { trackView } from '@/app/utils/tracking';
import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import {
  CarouselContent,
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

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

  const autoplayRef = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

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
          [...productsToTrack].map(async (productId) => {
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
          });
          // Optional: Wait for all tracking calls to settle if needed
        }
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px 100px 0px',
      }
    );

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
      const currentParams = new URLSearchParams(
        typeof searchParams === 'object'
          ? Object.entries(searchParams).reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {})
          : searchParams
      );

      currentParams.set('page', page.toString());
      const queryString = currentParams.toString();

      router.push(`/shop/${cat.join('/')}?${queryString}`);
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

  return (
    <div className="flex min-h-screen flex-col">
      {banner && banner.length > 0 ? (
        <header className="w-full overflow-hidden bg-[#d4d1ca]">
          <div className="relative mx-auto max-w-screen-xl">
            <Carousel
              className="w-full"
              plugins={[autoplayRef.current]}
              opts={{
                align: 'start',
                loop: true,
              }}
            >
              <CarouselContent>
                {banner.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[24vw] max-h-[380px] min-h-[210px] w-full">
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
                  </CarouselItem>
                ))}
              </CarouselContent>
              {banner.length > 1 && (
                <>
                  <CarouselPrevious className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-primary/30 p-2 text-white hover:bg-primary/50">
                    <ChevronLeft />
                  </CarouselPrevious>
                  <CarouselNext className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-primary/30 p-2 text-white hover:bg-primary/50">
                    <ChevronRight />
                  </CarouselNext>
                </>
              )}
            </Carousel>
          </div>
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
      <div className="sticky top-14 z-[25]">
        <ProductHeader
          cat={cat}
          searchParams={searchParams}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />
      </div>
      <div className="flex-1 px-2 md:px-6 lg:px-8">
        <h4 className="text-center font-oswald text-[13px] font-bold leading-[58px] tracking-widest text-primary md:text-left">
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
