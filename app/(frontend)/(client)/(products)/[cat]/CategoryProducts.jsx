"use client";

import Filter from "@/app/ui/products/filter";
import SubPageCampaign from "@/app/ui/page-campaign";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import ProductList from "@/app/ui/products-list";
import { useCartStore } from "@/store/store";
import { memo, useEffect } from "react";

export default memo(function CategoryProducts({ cat, searchParams }) {
  const setCurUICategory = useCartStore((state) => state.setCurUICategory);

  useEffect(() => {
    if (cat) {
      setCurUICategory(cat.toLowerCase());
    }
  }, [cat, setCurUICategory]);

  return (
    <>
      <div className="flex w-full items-center justify-center bg-gray-100 py-14 uppercase">
        <h1 className="text-3xl font-semibold">Women Selected Styles</h1>
      </div>
      <Filter />
      <div className="px-8 py-12">
        <ProductList cat={cat} searchParams={searchParams} />
      </div>

      <div
        className={`mb-10 flex items-center justify-center gap-5 bg-black text-white`}
      >
        <div className="basis-1/2 p-8">
          <SubPageCampaign
            className="border-white"
            heading_bg="after:bg-white before:bg-white"
          />
        </div>

        <div className="block w-1/2 flex-1 self-stretch">
          <Image
            alt="cat"
            className="h-full max-h-full object-cover"
            style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
            loading="lazy"
            src={image6}
          />
        </div>
      </div>
    </>
  );
});
