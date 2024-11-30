"use client";

import { useState, useEffect, useRef } from "react";

import SubPageCampaign from "@/app/ui/page-campaign";
import dynamic from "next/dynamic";
import { observeElement } from "@/utils/observer";
import Blog from "@/app/ui/blog";

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

export default function BelowFold() {
  const [showGallery, setShowGallery] = useState(false);
  const galleryRef = useRef(null);

  useEffect(() => {
    if (galleryRef.current) {
      observeElement(galleryRef.current, () => setShowGallery(true), {
        threshold: 0.1,
      });
    }
  }, []);

  return (
    <div className="">
      <Blog />
      <div ref={galleryRef} className="mx-auto bg-white px-4 sm:px-6 lg:px-8">
        {showGallery ? <Gallery /> : <GallerySkeleton />}
      </div>
    </div>
  );
}
