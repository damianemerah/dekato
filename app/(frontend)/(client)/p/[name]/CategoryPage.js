import { Suspense, lazy } from "react";
import { Spin } from "antd";
import "react-quill/dist/quill.snow.css";
import { unstable_cache } from "next/cache";
import { getProductById } from "@/app/action/productAction";
import RecommendedProducts from "@/app/ui/recommended-products";
import { SmallSpinner } from "@/app/ui/spinner";

const ProductDetail = lazy(() => import("@/app/ui/product/product-details"));

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

export default async function CategoryPage({ name }) {
  const id = name.split("-").slice(-1)[0];
  const product = await getProductData(id);

  return (
    <div>
      <Suspense fallback={<SmallSpinner />}>
        <ProductDetail product={product} />
      </Suspense>
    </div>
  );
}
