// "use client";
import Hero from "@/app/ui/home/Hero";
import SelectedCategories from "@/app/ui/home/selected-categories";
import Campaign from "@/app/ui/home/Campaign";
import { oswald } from "@/style/font";
import SubPageCampaign from "@/app/ui/page-campaign";
import Galley from "@/app/ui/home/Galley";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import RecommendedProducts from "@/app/ui/recommended-products";
import { Suspense } from "react";
import { SmallSpinner } from "@/app/ui/spinner";

const LoadingSpinner = function LoadingSpinner() {
  return (
    <div className="flex min-h-20 w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
};

export default function Home() {
  return (
    <div className={`${oswald.className} bg-gray-100`}>
      <Hero />
      <Suspense fallback={<LoadingSpinner />}>
        <SelectedCategories />
      </Suspense>
      <Campaign />
      <div className="">
        <h2 className="p-6 pt-9 text-3xl">YOU MAY LIKE</h2>
        <div className="mb-10">
          <RecommendedProducts category="men" />
        </div>
      </div>
      <div
        className={`mb-14 flex flex-col items-center justify-center gap-5 sm:flex-col md:flex-col lg:flex-row`}
      >
        <div className="block w-full flex-1 self-stretch sm:w-full md:w-full lg:w-1/2">
          <Image
            alt="cat"
            className="h-full max-h-full w-full object-cover"
            style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
            loading="lazy"
            src={image6}
          />
        </div>

        <SubPageCampaign
          className="w-full border-primary !text-primary lg:w-1/2"
          heading_bg="after:bg-primary before:bg-primary text-white"
        />
      </div>
      <Galley />
    </div>
  );
}
