import "react-quill/dist/quill.snow.css";
import { unstable_cache } from "next/cache";
import { getProductById } from "@/app/action/productAction";
import { LoadingSpinner } from "@/app/ui/spinner";
import { oswald } from "@/style/font";
import dynamic from "next/dynamic";
import ProductDetail from "@/app/ui/product/product-details";

const RecommendedProducts = dynamic(
  () => import("@/app/ui/recommended-products"),
  {
    loading: () => <LoadingSpinner />,
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

export default async function ProductInfo({ name }) {
  const id = name.split("-").slice(-1)[0];
  const product = await getProductData(id);

  return (
    <div>
      <ProductDetail product={product} />
      <h3 className={`${oswald.className} px-10 py-6 text-3xl font-bold`}>
        You May Also Like
      </h3>
      <RecommendedProducts category="men" />
    </div>
  );
}
