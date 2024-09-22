import CategoryProducts from "./CategoryProducts";
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";

const getAllCategories = async () => {
  await dbConnect();
  const categories = await Category.find({}).select("slug parent").lean();

  const buildCategoryPath = (category, allCategories) => {
    const path = [category.slug];
    let currentCategory = category;
    while (currentCategory.parent) {
      const parentCategory = allCategories.find(
        (c) => c._id.toString() === currentCategory.parent.toString(),
      );
      if (parentCategory) {
        path.unshift(parentCategory.slug);
        currentCategory = parentCategory;
      } else {
        break;
      }
    }

    return path;
  };

  return categories.map((category) => buildCategoryPath(category, categories));
};

// Update the generateStaticParams function
export async function generateStaticParams() {
  const categoryPaths = await getAllCategories();

  return categoryPaths.map((path) => ({
    cat: path,
  }));
}

export default async function Product({ params: { cat }, searchParams }) {
  return (
    <div className="bg-gray-100">
      <CategoryProducts cat={cat} searchParams={searchParams} />
    </div>
  );
}
