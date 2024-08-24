import Filter from "@/app/ui/products/filter";
import SubPageCampaign from "@/app/ui/SubPageCampaign";
import ProductList from "@/app/ui/products-list";

export default function Product({ params: { cat }, searchParams }) {
  console.log(cat, `cat😎`);

  return (
    <>
      <div className="flex w-full items-center justify-center bg-gray-100 py-14 uppercase">
        <h1 className="text-3xl font-semibold">Women Selected Styles</h1>
      </div>
      <Filter />
      <div className="px-8 py-12">
        <ProductList />
      </div>
    </>
  );
}
