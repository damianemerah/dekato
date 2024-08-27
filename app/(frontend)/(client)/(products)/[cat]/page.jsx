import CategoryProducts from "./CategoryProducts";
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";

const getAllCategories = async () => {
  await dbConnect();
  const categories = await Category.find({}).select("slug").lean();

  return categories.map((category) => category.slug);
};

export async function generateStaticParams() {
  console.log("Fetching category products 🎈🎈🎈");
  const categories = await getAllCategories();

  return categories.map((slug) => ({
    cat: slug,
  }));
}

export default async function Product({ params: { cat }, searchParams }) {
  return <CategoryProducts cat={cat} searchParams={searchParams} />;
}
