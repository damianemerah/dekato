import CategoryProducts from "./CategoryProducts";
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";
// import Filter from "@/app/ui/products/Filter";
import Filter from "@/app/ui/products/filter";
import SubPageCampaign from "@/app/ui/SubPageCampaign";
import ProductList from "@/app/ui/products-list";

const getAllCategories = async () => {
  await dbConnect();
  const categories = await Category.find({}).select("slug").lean();

  console.log(categories, "categories🔥🔥🔥");
  return categories.map((category) => category.slug);
};

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((slug) => ({
    cat: slug,
  }));
}

// export default async function Product({ params: { cat }, searchParams }) {
//   return <CategoryProducts cat={cat} searchParams={searchParams} />;
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
