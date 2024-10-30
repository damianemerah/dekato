import Category from "@/models/category";
import Campaign from "@/models/collection";
import dbConnect from "@/lib/mongoConnection";
import { SmallSpinner } from "@/app/ui/spinner";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";

const CategoryProducts = dynamic(
  () => import("@/app/ui/products/categoried-products"),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  },
);

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

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
      <CategoryProducts cat={cat} searchParams={searchParams} />
    </main>
  );
}
