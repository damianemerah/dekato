'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import BlogCard from '@/app/components/blog-card';
import { useSidebar } from '@/app/components/ui/sidebar';

export default function BlogCarousel({ blogs }) {
  const { open, isMobile } = useSidebar();

  return (
    <div
      className={`w-full overflow-hidden ${open && !isMobile ? 'pr-0' : ''}`}
    >
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {blogs.map((blog) => (
            <CarouselItem
              key={blog.id}
              className="pl-2 md:basis-1/2 md:pl-4 lg:basis-1/3"
            >
              <div className="h-full">
                <BlogCard blog={blog} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </div>
      </Carousel>
    </div>
  );
}
