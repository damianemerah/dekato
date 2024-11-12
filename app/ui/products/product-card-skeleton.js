export default function ProductCardSkeleton() {
  return (
    <div className="mb-0.5 ml-2 w-[calc(50%-8px)] md:w-[calc(33.333%-8px)] md:min-w-56 lg:w-[calc(25%-8px)]">
      <div className="flex h-full flex-col bg-white text-center transition-all duration-300 hover:shadow-md">
        <div className="relative w-full overflow-hidden pb-[133.33%]">
          <div className="absolute left-0 top-0 h-full w-full animate-pulse bg-gray-200"></div>
        </div>
        <div className="flex flex-1 flex-col items-center pb-8 pt-1 text-[13px]">
          <div className="mb-0.5 h-4 w-full animate-pulse bg-gray-200"></div>
          <div className="mb-1 h-4 w-full animate-pulse bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
