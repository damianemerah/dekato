"use client";
import Hero from "@/app/ui/home/Hero";
import HomeCategory from "@/app/ui/home/HomeCategory";
import Campaign from "@/app/ui/home/Campaign";
import { oswald } from "@/style/font";
import SubPageCampaign from "@/app/ui/page-campaign";
import Galley from "@/app/ui/home/Galley";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import RecommendedProducts from "@/app/ui/recommended-products";

export default function Home() {
  return (
    <div className={`${oswald.className} bg-gray-100`}>
      <Hero />
      <HomeCategory />
      <Campaign />
      <div className="">
        <h2 className="p-6 pt-9 text-3xl">YOU MAY LIKE</h2>
        <div className="mb-10">
          <RecommendedProducts />
        </div>
      </div>
      <div className={`mb-14 flex items-center justify-center gap-5`}>
        <div className="block w-1/2 flex-1 self-stretch">
          <Image
            alt="cat"
            className="h-full max-h-full object-cover"
            style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
            loading="lazy"
            src={image6}
          />
        </div>

        <SubPageCampaign
          className="border-black"
          heading_bg="after:bg-black before:bg-black"
        />
      </div>
      <Galley />
    </div>
  );
}
