export default function SelectedCategoriesSkeleton() {
  return (
    <div className="font-oswald min-h-[300px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:ml-4 md:ml-8">
        <div className="h-8 w-48 animate-pulse bg-gray-200" />
        <div className="mb-4 mt-4 flex flex-wrap gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-4 md:gap-6">
          <div className="h-5 w-20 animate-pulse bg-gray-200" />
          <div className="flex gap-4">
            <div className="h-6 w-16 animate-pulse bg-gray-200" />
            <div className="h-6 w-16 animate-pulse bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-4 sm:gap-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-1/3 flex-none md:w-1/4 lg:w-[calc(100%/5-16px)]"
            >
              <div className="aspect-square w-full animate-pulse bg-gray-200">
                <div className="flex h-full items-end justify-center">
                  <div className="h-8 w-32 rounded bg-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
