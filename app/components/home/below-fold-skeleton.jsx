import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel';

export default function BelowFoldSkeleton() {
  return (
    <div className="w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="mb-6 flex justify-center">
            <div className="h-8 w-48 animate-pulse bg-gray-200" />
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {[...Array(3)].map((_, i) => (
                <CarouselItem
                  key={i}
                  className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
                >
                  <div className="h-full">
                    <div className="flex w-full flex-shrink-0 flex-grow-0 flex-col shadow-sm">
                      <div className="relative aspect-[16/9] w-full overflow-hidden">
                        <div className="h-full w-full animate-pulse bg-gray-200" />
                      </div>
                      <div className="flex flex-col p-4 sm:p-6">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                        </div>
                        <div className="mb-3 h-6 w-full animate-pulse rounded bg-gray-200" />
                        <div className="mb-4 h-16 w-full animate-pulse rounded bg-gray-200" />
                        <div className="mt-auto flex justify-center">
                          <div className="h-8 w-28 animate-pulse rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Gallery skeleton */}
        <div className="py-12">
          <div className="mb-6 h-8 w-64 animate-pulse bg-gray-200" />
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 sm:gap-3">
            {[...Array(7)].map((_, index) => (
              <div
                key={index}
                className={`${index === 2 ? 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2' : ''} relative`}
              >
                <div className="aspect-square w-full animate-pulse bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
