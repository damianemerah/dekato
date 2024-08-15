import CategoryProducts from "./CategoryProducts";
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";

const getAllCategories = async () => {
  await dbConnect();
  const categories = await Category.find({}).select("slug");

  console.log(categories, "categories🔥🔥🔥");
  return categories.map((category) => category.slug);
};

export async function generateStaticParams() {
  const categories = await getAllCategories();

  console.log(
    categories.map((category) => ({
      cat: category,
    })),
    "categories⭐⭐❤️❤️",
  );

  return categories.map((category) => ({
    cat: category,
  }));
}

export default function Product({ params: { cat }, searchParams }) {
  return <CategoryProducts cat={cat} searchParams={searchParams} />;
}
