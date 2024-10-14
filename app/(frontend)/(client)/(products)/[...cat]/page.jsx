import CategoryProducts from "./CategoryProducts";
import Category from "@/models/category";
import Campaign from "@/models/collection";
import dbConnect from "@/lib/mongoConnection";
import { Suspense, memo } from "react";
import { SmallSpinner } from "@/app/ui/spinner";
import { unstable_cache } from "next/cache";

export const dynamic = "force-dynamic";

async function getAllCategoryPaths() {
  await dbConnect();
  const categories = await Category.find({}).select("slug parent").lean();
  const collections = await Campaign.find({}).select("slug").lean();

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

  const categoryPaths = categories.map((category) =>
    buildCategoryPath(category, categories),
  );
  const collectionPaths = collections.map((collection) => [collection.slug]);

  return [...categoryPaths, ...collectionPaths];
}

const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
});

export async function generateStaticParams() {
  const categoryPaths = await unstable_cache(
    async () => await getAllCategoryPaths(),
    ["categoryPaths"],
    { revalidate: 10 }, // Revalidate every 30 seconds
  )();

  const paths = categoryPaths.map((path) => ({
    cat: path,
  }));

  return paths;
}

export default function Product({ params: { cat }, searchParams }) {
  return (
    <main>
      <Suspense fallback={<LoadingSpinner />}>
        <CategoryProducts cat={cat} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
