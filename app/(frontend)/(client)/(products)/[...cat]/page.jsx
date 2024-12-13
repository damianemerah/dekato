import Category from "@/models/category";
import Campaign from "@/models/collection";
import dbConnect from "@/lib/mongoConnection";
import { LoadingSpinner } from "@/app/ui/spinner";
import { unstable_cache } from "next/cache";
import dynamic from "next/dynamic";

const CategoryProducts = dynamic(
  () => import("@/app/ui/products/categoried-products"),
  {
    loading: () => <LoadingSpinner className="min-h-screen" />,
    ssr: true,
  },
);

// Helper function to get category/collection data
async function getCategoryData(cat) {
  await dbConnect();

  const path = cat.join("/");
  console.log(path, "path🔥🔥🔥");
  // Try to find as category first
  let data = await Category.findOne({
    path: { $all: path },
  })
    .select("name description metaTitle metaDescription")
    .lean();

  // If not found, try as collection
  if (!data) {
    data = await Campaign.findOne({
      path: { $all: path },
    })
      .select("name description metaTitle metaDescription")
      .lean();
  }

  return data;
}

export async function generateMetadata({ params: { cat } }, parent) {
  // Get base metadata from parent
  const parentMetadata = await parent;
  const previousImages = parentMetadata?.openGraph?.images || [];

  // Get category/collection data
  const data = await unstable_cache(
    () => getCategoryData(cat),
    [`category-meta-${cat.join("-")}`],
    { revalidate: 1800 },
  )();

  if (!data) {
    return {
      title: "Products",
      description: "Browse our products",
    };
  }

  return {
    title: data.metaTitle || data.name,
    description:
      data.metaDescription ||
      data.description ||
      `Browse our ${data.name} products`,
    openGraph: {
      title: data.metaTitle || data.name,
      description:
        data.metaDescription ||
        data.description ||
        `Browse our ${data.name} products`,
      images: [...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle || data.name,
      description:
        data.metaDescription ||
        data.description ||
        `Browse our ${data.name} products`,
    },
  };
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
  return <CategoryProducts cat={cat} searchParams={searchParams} />;
}
