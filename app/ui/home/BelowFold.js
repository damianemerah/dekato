"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import SubPageCampaign from "@/app/ui/page-campaign";
import dynamic from "next/dynamic";
import { observeElement } from "@/utils/observer";

const Gallery = dynamic(() => import("@/app/ui/home/Gallery"), {
  loading: () => <GallerySkeleton />,
  ssr: false,
});

function GallerySkeleton() {
  return (
    <div className="grid w-full animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {[...Array(7)].map((_, index) => (
        <div
          key={index}
          className={`h-48 rounded bg-gray-300 ${
            index === 2
              ? "col-span-2 h-96 sm:col-span-1 sm:h-48 md:col-span-2 md:h-96"
              : ""
          }`}
        ></div>
      ))}
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
      <div className="mb-14 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 bg-white lg:flex-row lg:items-stretch">
          <div className="w-full lg:w-1/2">
            <Image
              alt="Featured campaign image"
              className="h-full max-h-[400px] w-full object-cover shadow-lg"
              src={image6}
              placeholder="blur"
              priority
            />
          </div>
          <SubPageCampaign
            className="w-full border-primary !text-primary lg:w-1/2"
            heading_bg="!after:bg-primary !before:bg-primary text-primary"
          />
        </div>
      </div>
      <div ref={galleryRef} className="mx-auto bg-white px-4 sm:px-6 lg:px-8">
        {showGallery ? <Gallery /> : <GallerySkeleton />}
      </div>
    </div>
  );
}
