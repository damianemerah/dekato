import { unstable_cache } from "next/cache";
import { getProductById } from "@/app/action/productAction";
import dynamic from "next/dynamic";
import ProductDetail from "@/app/ui/product/product-details";
import RecommendedProductsSkeleton from "@/app/ui/recommended-products-skeleton";

const RecommendedProducts = dynamic(
  () => import("@/app/ui/recommended-products"),
  {
    loading: () => <RecommendedProductsSkeleton />,
    ssr: false,
  },
);

const getProductData = unstable_cache(
  async (id) => {
    return await getProductById(id);
  },
  ["product-data"],
  {
    tags: ["single-product-data"],
    revalidate: 10,
  },
);

export async function generateMetadata({ params }, parent) {
  const id = params.name.split("-").slice(-1)[0];
  const product = await getProductData(id);

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.image[0],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.image[0],
    },
  };
}

export default async function ProductInfoPage({ params: { name } }) {
  const id = name.split("-").slice(-1)[0];
  const product = await getProductData(id);

  return (
    <div>
      <ProductDetail product={product} />
      <RecommendedProducts productId={id} />
    </div>
  );
}
