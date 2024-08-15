import { getAllCategories } from "@/app/action/categoryAction";
import CategoryProducts from "./CategoryProducts";

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    cat: category.slug,
  }));
}

export default function Product({ params: { cat }, searchParams }) {
  return <CategoryProducts cat={cat} searchParams={searchParams} />;
}
