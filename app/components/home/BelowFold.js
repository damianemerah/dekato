'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { observeElement } from '@/app/utils/observer';
import BlogCard from '@/app/components/blog-card';
import useSWR from 'swr';
import { getAllBlogs } from '@/app/action/blogAction';
import { Button } from '../button';
import Link from 'next/link';

const Gallery = dynamic(() => import('@/app/components/home/Gallery'), {
  loading: () => <GallerySkeleton />,
  ssr: false,
});

function GallerySkeleton() {
  return (
    <div className="mb-10">
      <h2 className={`py-6 font-oswald`}>
        <div className="h-8 w-64 animate-pulse bg-gray-200" />
      </h2>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 sm:gap-3">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className={`${
              index === 2
                ? 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2'
                : ''
            } relative`}
          >
            <div className="aspect-square w-full animate-pulse bg-gray-200">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-300/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="my-10 bg-white px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="mx-auto h-8 w-48 animate-pulse bg-gray-200" />
      </div>
      <div className="relative">
        <div className="lg:no-scrollbar flex snap-x gap-4 overflow-x-auto overflow-y-hidden scroll-smooth">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2/3 min-w-[280px] max-w-[420px] flex-shrink-0 snap-start bg-white first:pl-0 sm:w-[calc(50vw-3rem)]"
            >
              <div className="flex flex-col shadow-sm">
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BelowFold() {
  const [showGallery, setShowGallery] = useState(false);
  const galleryRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

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

  useEffect(() => {
    const updateMaxScroll = () => {
      if (containerRef.current) {
        setMaxScroll(
          containerRef.current.scrollWidth - containerRef.current.clientWidth
        );
      }
    };

    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);

    return () => window.removeEventListener('resize', updateMaxScroll);
  }, [blogs]);

  const scroll = (direction) => {
    if (!containerRef.current) return;

    const cardWidth =
      containerRef.current.querySelector('div')?.offsetWidth || 300;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - cardWidth)
        : Math.min(maxScroll, scrollPosition + cardWidth);

    setScrollPosition(newPosition);
    containerRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth',
    });
  };

  if (!isLoading && !blogs) return null;

  return (
    <div className="">
      {isLoading ? (
        <BlogSkeleton />
      ) : (
        blogs?.data && (
          <div className="px-6 py-12 lg:px-14 xl:px-28">
            <h2 className={`mb-6 text-center font-oswald font-bold`}>
              LATEST FASHION
            </h2>
            <div className="relative">
              <div
                ref={containerRef}
                className="no-scrollbar flex snap-x gap-4 overflow-x-auto overflow-y-hidden scroll-smooth md:gap-8"
              >
                {blogs?.data?.map((blog) => (
                  <div key={blog.id} className="h-full w-full bg-white">
                    <BlogCard
                      blog={blog}
                      className="h-full w-full !text-primary"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <Link href="/fashion">
                <Button
                  className="mt-auto inline-flex items-center justify-center px-4 py-1.5 text-sm font-semibold uppercase transition-colors hover:bg-primaryDark hover:text-white sm:px-6"
                  aria-label="View all fashion blog posts"
                  aria-describedby="fashion-blog-description"
                >
                  View more
                </Button>
              </Link>
            </div>
          </div>
        )
      )}
      <div ref={galleryRef} className="mx-auto bg-white px-4 sm:px-6 lg:px-8">
        {showGallery ? <Gallery /> : <GallerySkeleton />}
      </div>
    </div>
  );
}
