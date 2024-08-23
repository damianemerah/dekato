import Filter from "@/app/ui/products/Filter";
import SubPageCampaign from "@/app/ui/SubPageCampaign";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import ProductList from "@/app/ui/recommended-products";

export default function Product({ params: { cat }, searchParams }) {
  console.log(cat, `cat😎`);
  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex w-full items-center justify-center bg-gray-100 py-14 uppercase">
        <h1 className="text-3xl font-semibold">Women Selected Styles</h1>
      </div>
      <Filter />
    </div>
  );
}
