"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { observeElement } from "@/utils/observer";
import BlogCard from "@/app/ui/blog-card";
import useSWR from "swr";
import { getAllBlogs } from "@/app/action/blogAction";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Gallery = dynamic(() => import("@/app/ui/home/Gallery"), {
  loading: () => <GallerySkeleton />,
  ssr: false,
});

function GallerySkeleton() {
  return (
    <div className="mb-10">
      <h2 className="py-6 font-oswald font-bold">FOLLOW OUR INSTAGRAM</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
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
    <div className="my-10 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto overflow-y-hidden scroll-smooth">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-[calc(100vw-3rem)] min-w-[280px] max-w-[480px] flex-shrink-0 animate-pulse snap-start bg-gray-100 first:pl-0 sm:w-[calc(50vw-3rem)] lg:w-[calc(33.333vw-3rem)]"
            >
              <div className="aspect-[16/9]" />
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

  return (
    <div className="">
      {isLoading ? (
        <BlogSkeleton />
      ) : (
        <div className="my-10 px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div
              ref={containerRef}
              className="no-scrollbar flex snap-x gap-4 overflow-x-auto overflow-y-hidden scroll-smooth"
            >
              {blogs?.data?.map((blog) => (
                <div
                  key={blog.id}
                  className="w-[calc(100vw-3rem)] min-w-[280px] max-w-[480px] flex-shrink-0 snap-start bg-white first:pl-0 sm:w-[calc(50vw-3rem)] lg:w-[calc(33.333vw-3rem)]"
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
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div ref={galleryRef} className="mx-auto bg-white px-4 sm:px-6 lg:px-8">
        {showGallery ? <Gallery /> : <GallerySkeleton />}
      </div>
    </div>
  );
}
