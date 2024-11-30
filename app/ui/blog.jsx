"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SubPageCampaign from "@/app/ui/page-campaign";

export default function Blog() {
  const containerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

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
  }, []);

  const scroll = useCallback(
    (direction) => {
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
    },
    [scrollPosition, maxScroll],
  );

  return (
    <div className="my-10 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div
          ref={containerRef}
          className="no-scrollbar flex snap-x gap-4 overflow-x-auto overflow-y-hidden scroll-smooth"
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-[calc(100vw-3rem)] min-w-[280px] max-w-[480px] flex-shrink-0 snap-start bg-white first:pl-0 sm:w-[calc(50vw-3rem)] lg:w-[calc(33.333vw-3rem)]"
            >
              <SubPageCampaign
                className="h-full w-full border-primary !text-primary"
                heading_bg="!after:bg-primary !before:bg-primary text-primary"
              />
            </div>
          ))}
        </div>

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
          aria-label="View more items"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
