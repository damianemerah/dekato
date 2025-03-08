'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { observeElement } from '@/app/utils/observer';
import useSWR from 'swr';
import { getAllBlogs } from '@/app/action/blogAction';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Skeleton } from '@/app/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel';
import BlogCard from '@/app/components/blog-card';
import { useSidebar } from '@/app/components/ui/sidebar'; // Import useSidebar hook

const Gallery = dynamic(() => import('@/app/components/home/gallery'), {
  loading: () => <GallerySkeleton />,
  ssr: false,
});

function GallerySkeleton() {
  return (
    <div className="mb-10">
      <div className="py-6">
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 sm:gap-3">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className={`${index === 2 ? 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2' : ''} relative`}
          >
            <Skeleton className="aspect-square w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="my-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Skeleton className="mx-auto h-8 w-48" />
      </div>
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {[...Array(3)].map((_, i) => (
              <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <div className="overflow-hidden rounded-md">
                    <Skeleton className="aspect-[16/9] w-full" />
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="mb-3 h-6 w-full" />
                      <Skeleton className="mb-4 h-16 w-full" />
                      <div className="mt-auto flex justify-center">
                        <Skeleton className="h-8 w-28" />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}

export default function BelowFold() {
  const [showGallery, setShowGallery] = useState(false);
  const galleryRef = useRef(null);
  const { open, isMobile } = useSidebar(); // Get sidebar state from your hook

  const { data: blogs, isLoading } = useSWR('/api/blogs', () =>
    getAllBlogs({ limit: 3, status: 'published' })
  );

  useEffect(() => {
    if (galleryRef.current) {
      observeElement(galleryRef.current, () => setShowGallery(true), {
        threshold: 0.1,
      });
    }
  }, []);

  if (!isLoading && !blogs) return null;

  return (
    <div className="w-full overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <BlogSkeleton />
        ) : (
          blogs?.data && (
            <div className="py-12">
              <h2 className="font-oswald mb-6 text-center font-bold">
                LATEST FASHION
              </h2>

              <div
                className={`w-full overflow-hidden ${open && !isMobile ? 'pr-0' : ''}`}
              >
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {blogs?.data?.map((blog) => (
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

              <div className="mt-6 flex items-center justify-center">
                <Link href="/fashion">
                  <Button
                    variant="outline"
                    className="mt-auto font-semibold uppercase transition-colors hover:bg-primary hover:text-white"
                    aria-label="View all fashion blog posts"
                  >
                    View more
                  </Button>
                </Link>
              </div>
            </div>
          )
        )}
        <div ref={galleryRef} className="mx-auto">
          {showGallery ? <Gallery /> : <GallerySkeleton />}
        </div>
      </div>
    </div>
  );
}
