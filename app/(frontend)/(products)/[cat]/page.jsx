import Filter from "@/app/ui/products/Filter";
import SubPageCampaign from "@/app/ui/SubPageCampaign";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import ProductList from "@/app/ui/products/ProductList";

export default function Product({ params: { cat } }) {
  console.log(cat, `cat😎`);
  return (
    <div>
      <Filter />
      <ProductList cat={cat} />
      <div
        className={`flex items-center justify-center mb-10 gap-5 bg-black text-white
      `}
      >
        <div className="p-8 basis-1/2">
          <SubPageCampaign
            className="border-white"
            heading_bg="after:bg-white before:bg-white"
          />
        </div>
        <div className="block w-1/2 flex-1 self-stretch">
          <Image
            alt="cat"
            className="max-h-full object-cover h-full"
            style={{ boxShadow: "10px 10px 24px 0 rgba(0, 0, 0, 0.24)" }}
            loading="lazy"
            src={image6}
            width="100%"
            height="auto"
          />
        </div>
      </div>
    </div>
  );
}
