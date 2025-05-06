"use client";
import { Pagination as AntdPagination } from "antd";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProductCardSkeleton from "@/app/ui/products/product-card-skeleton";
import HeaderOne from "@/app/ui/heading1";
import Image from "next/image";
import { Suspense, useMemo, useState, useCallback, useEffect } from "react";
import { useUserStore } from "@/store/store";
import { trackView, activityQueue } from "@/utils/tracking";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MAX_TRACK_TIME = 5000;

const ProductHeader = dynamic(
  () => import("@/app/ui/products/product-header"),
  {
    loading: () => (
      <div className="sticky top-0 z-10 mb-10 bg-gray-100">
        <div className="flex h-14 w-full items-center justify-between px-8 shadow-md">
          <div className="h-4 w-full animate-pulse bg-gray-300"></div>
        </div>
      </div>
    ),
    ssr: false,
  },
);

const ProductCard = dynamic(() => import("./product-card"), {
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

        // Track all products that meet criteria in one batch
        if (productsToTrack.size > 0) {
          [...productsToTrack].forEach((productId) => {
            activityQueue.push((cb) => {
              try {
                trackView(userId, productId)
                  .then(() => {
                    setTrackedProducts((prev) => new Set([...prev, productId]));
                    cb();
                  })
                  .catch((err) => {
                    cb(err);
                  });
              } catch (error) {
                cb(error);
              }
            });
          });
        }
      },
      {
        threshold: 0.5, // Product is considered visible when 50% in view
        rootMargin: "0px 0px 100px 0px", // Add margin to start loading earlier
      },
    );

    // Observe all product cards
    const productCards = document.querySelectorAll("[data-product-id]");
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

  const handlePageChange = (page) => {
    const newSearchParams = { ...searchParams, page: page.toString() };
    const queryString = new URLSearchParams(newSearchParams).toString();
    router.push(`/${cat.join("/")}?${queryString}`);
    // Reset tracked products when page changes
    setTrackedProducts(new Set());
  };

  const currentCategory = useMemo(
    () =>
      cat.slice(-1)[0].toLowerCase() === "search"
        ? `${products.length} results for ${searchParams.q}`
        : cat.slice(-1)[0],
    [cat, products, searchParams],
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
    <>
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
                  src={image}
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
                    className={`h-2 w-2 rounded-full ${
                      currentSlide === index ? "bg-white" : "bg-white/50"
                    }`}
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

      <div className="px-2 md:px-6 lg:px-8">
        <h4 className="text-priamry text-center font-oswald text-[13px] font-bold leading-[58px] tracking-widest md:text-left">
          {totalCount} ITEMS
        </h4>
        <div className="grid grid-cols-2 gap-2 bg-white md:grid-cols-3 md:gap-3 lg:grid-cols-4">
          {products &&
            products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
        </div>
        {/* page footer */}
        <div className="my-6 flex justify-center">
          <AntdPagination
            current={parseInt(currentPage)}
            total={totalCount}
            pageSize={parseInt(limit)}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    </>
  );
};

export default ProductList;
