export default function ProductCardSkeleton(key) {
  return (
    <div key={key} className="flex flex-col bg-white">
      <div className="relative w-full overflow-hidden pb-[133.33%]">
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      </div>
      <div className="flex flex-1 flex-col items-center p-4">
        <div className="mb-2 h-5 w-3/4 animate-pulse bg-gray-200" />
        <div className="mb-1 h-4 w-1/2 animate-pulse bg-gray-200" />
        {Math.random() > 0.5 && (
          <div className="mt-2 flex gap-2">
            {[...Array(3)].map((_, j) => (
              <div
                key={j}
                className="h-6 w-6 animate-pulse rounded-full bg-gray-200"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
