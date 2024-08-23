import CategoryProducts from "./CategoryProducts";
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";
import Filter from "@/app/ui/products/Filter";
import SubPageCampaign from "@/app/ui/SubPageCampaign";
import Image from "next/image";
import image6 from "@/public/assets/image6.png";
import ProductList from "@/app/ui/recommended-products";

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

export default async function Product({ params: { cat }, searchParams }) {
  return <CategoryProducts cat={cat} searchParams={searchParams} />;
}
