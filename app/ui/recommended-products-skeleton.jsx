export default function RecommendedProductsSkeleton() {
  return (
    <div className="mb-10 px-4">
      <div className="h-8 w-48 animate-pulse bg-gray-200" />{" "}
      {/* Title skeleton */}
      <div className="relative mt-4">
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-[calc(50%-8px)] flex-shrink-0 md:w-[calc(33.333%-12px)] lg:w-[calc(25%-12px)]"
            >
              <div className="flex h-full flex-col bg-white text-center">
                <div className="relative w-full overflow-hidden pb-[133.33%]">
                  <div className="absolute left-0 top-0 h-full w-full animate-pulse bg-gray-200"></div>
                </div>
                <div className="flex flex-1 flex-col items-center pb-4 pt-1">
                  <div className="mb-0.5 h-4 w-full animate-pulse bg-gray-200"></div>
                  <div className="mb-1 h-4 w-full animate-pulse bg-gray-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
