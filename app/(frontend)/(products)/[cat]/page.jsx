import Filter from "@/app/ui/products/Filter";
import SubPageCampaign from "@/app/ui/SubPageCampaign";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import ProductList from "@/app/ui/recommended-products";

export default function Product({ params: { cat }, searchParams }) {
  console.log(cat, `cat😎`);
  return (
    <div>
      <Filter />
      <ProductList cat={cat} searchParams={searchParams} />
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
    </div>
  );
}
