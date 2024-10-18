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

  const [categories, collections] = await Promise.all([
    Category.find().select("slug path").lean(),
    Campaign.find().select("slug path").lean(),
  ]);

  const categoryPaths = categories.map((category) => category.path);
  const collectionPaths = collections.map((collection) => collection.path);

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
  const paths = await unstable_cache(getAllCategoryPaths, ["categoryPaths"], {
    revalidate: 1800,
  })();

  const filteredPaths = paths.map((path) => ({
    cat: path.map((p) => (p.includes("/") ? p.split("/")[1] : p)),
  }));

  return filteredPaths;
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
