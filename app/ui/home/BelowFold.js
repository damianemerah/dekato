"use client";

import { oswald } from "@/style/font";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { observeElement } from "@/utils/observer";
import BlogCard from "@/app/ui/blog-card";
import useSWR from "swr";
import { getAllBlogs } from "@/app/action/blogAction";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../button";
import Link from "next/link";

const Gallery = dynamic(() => import("@/app/ui/home/Gallery"), {
  loading: () => <GallerySkeleton />,
  ssr: false,
});

function GallerySkeleton() {
  return (
    <div className="mb-10">
      <h2 className={`${oswald.className} py-6`}>FOLLOW OUR INSTAGRAM</h2>
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 sm:gap-3">
        {[...Array(7)].map((_, index) => (
          <div
            key={index}
            className={`${
              index === 2
                ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2"
                : ""
            }`}
          >
            <div className="aspect-square w-full animate-pulse bg-gray-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
function BlogSkeleton() {
  return (
    <div className="my-10 bg-white px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto overflow-y-hidden scroll-smooth">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-[75vw] min-w-[280px] max-w-[480px] flex-shrink-0 snap-start first:pl-0 sm:w-[calc(50vw-3rem)] lg:w-[calc(33.333vw-9rem)]"
            >
              <div className="aspect-[16/9] animate-pulse bg-gray-200" />
              <div className="mt-4 space-y-3">
                <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="h-20 animate-pulse rounded bg-gray-200" />
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

  const { data: blogs, isLoading } = useSWR("/api/blogs", () =>
    getAllBlogs({ limit: 3, status: "published" }),
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
          containerRef.current.scrollWidth - containerRef.current.clientWidth,
        );
      }
    };

    updateMaxScroll();
    window.addEventListener("resize", updateMaxScroll);

    return () => window.removeEventListener("resize", updateMaxScroll);
  }, [blogs]);

  const scroll = (direction) => {
    if (!containerRef.current) return;

    const cardWidth =
      containerRef.current.querySelector("div")?.offsetWidth || 300;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - cardWidth)
        : Math.min(maxScroll, scrollPosition + cardWidth);

    setScrollPosition(newPosition);
    containerRef.current.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  };

  if (!isLoading && !blogs) return null;

  return (
    <div className="">
      {isLoading ? (
        <BlogSkeleton />
      ) : (
        <div className="px-4 py-12 sm:px-6 lg:px-8">
          <h2
            className={`${oswald.className} mb-6 text-center font-bold md:text-left`}
          >
            LATEST FASION
          </h2>
          <div className="relative">
            <div
              ref={containerRef}
              className="no-scrollbar flex snap-x gap-4 overflow-x-auto overflow-y-hidden scroll-smooth md:gap-8"
            >
              {blogs?.data?.map((blog) => (
                <div
                  key={blog.id}
                  className="w-[75vw] min-w-[280px] max-w-[480px] flex-shrink-0 snap-start bg-white first:pl-0 sm:w-[calc(50vw-3rem)] lg:w-[calc(33.333vw-3rem)]"
                >
                  <BlogCard
                    blog={blog}
                    className="h-full w-full border-primary !text-primary"
                  />
                </div>
              ))}
            </div>

            {blogs?.data?.length > 0 && (
              <>
                <button
                  onClick={() => scroll("left")}
                  disabled={scrollPosition <= 0}
                  className={`absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-md transition-opacity hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    scrollPosition <= 0 ? "opacity-50" : "opacity-100"
                  }`}
                  aria-label="View previous items"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={scrollPosition >= maxScroll}
                  className={`absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-md transition-opacity hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    scrollPosition >= maxScroll ? "opacity-50" : "opacity-100"
                  }`}
                  aria-label="View next items"
                >
                  <ChevronRight className="wp-6 h-6" />
                </button>
              </>
            )}
          </div>
          <div className="mt-6 flex items-center justify-center">
            <Link href="/fashion">
              <Button
                className="mt-auto inline-flex items-center justify-center px-4 py-1 text-sm font-semibold uppercase transition-colors hover:bg-primary hover:text-white sm:px-6"
                aria-label="View all fashion blog posts"
                aria-describedby="fashion-blog-description"
              >
                View more
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div ref={galleryRef} className="mx-auto bg-white px-4 sm:px-6 lg:px-8">
        {showGallery ? <Gallery /> : <GallerySkeleton />}
      </div>
    </div>
  );
}
