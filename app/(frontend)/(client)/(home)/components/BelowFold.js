"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import SubPageCampaign from "@/app/ui/page-campaign";
import dynamic from "next/dynamic";
import { observeElement } from "@/utils/observer";

const Galley = dynamic(() => import("@/app/ui/home/Galley"), {
  loading: () => <GallerySkeleton />,
  ssr: false,
});

function GallerySkeleton() {
  return (
    <div className="grid w-full animate-pulse grid-cols-2 gap-4">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="h-48 rounded bg-gray-300 last:col-span-2 last:h-80"
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
    <>
      <div
        className={`mb-14 flex flex-col items-center justify-center gap-5 sm:flex-col md:flex-col lg:flex-row`}
      >
        <div className="block max-h-[400px] w-full flex-1 self-stretch sm:w-full md:w-full lg:w-1/2">
          <Image
            alt="cat"
            className="w-ful h-full max-h-full bg-center object-cover"
            style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
            loading="lazy"
            src={image6}
          />
        </div>

        <SubPageCampaign
          className="w-full border-primary !text-primary lg:w-1/2"
          heading_bg="after:bg-primary before:bg-primary text-primary"
        />
      </div>
      <div ref={galleryRef}>
        {showGallery ? <Galley /> : <GallerySkeleton />}
      </div>
    </>
  );
}
