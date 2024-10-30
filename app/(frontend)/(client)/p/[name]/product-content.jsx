import "react-quill/dist/quill.snow.css";
import { unstable_cache } from "next/cache";
import { getProductById } from "@/app/action/productAction";
import { SmallSpinner } from "@/app/ui/spinner";
import dynamic from "next/dynamic";

const ProductDetail = dynamic(
  () => import("@/app/ui/product/product-details"),
  {
    ssr: false,
    loading: SmallSpinner,
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
    </div>
  );
}
