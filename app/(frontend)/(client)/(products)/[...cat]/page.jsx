import CategoryProducts from "./CategoryProducts";
import Category from "@/models/category";
import dbConnect from "@/lib/mongoConnection";
import { Suspense } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { BigSpinner } from "@/app/ui/spinner";

export const dynamic = "force-dynamic";

async function getAllCategoryPaths() {
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
}

export async function generateStaticParams() {
  const categoryPaths = await getAllCategoryPaths();

  return categoryPaths.map((path) => ({
    cat: path,
  }));
}

export default function Product({ params: { cat }, searchParams }) {
  return (
    <>
      <Suspense fallback={<BigSpinner />}>
        <CategoryProducts cat={cat} searchParams={searchParams} />
      </Suspense>
    </>
  );
}
