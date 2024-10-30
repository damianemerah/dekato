import { Suspense } from "react";
import { oswald } from "@/style/font";
import { SmallSpinner } from "@/app/ui/spinner";
import dynamic from "next/dynamic";

const ProductInfo = dynamic(() => import("./product-content"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const RecommendedProducts = dynamic(
  () => import("@/app/ui/recommended-products"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  },
);

function LoadingSpinner() {
  return (
    <div className="flex min-h-40 w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function ProductInfoPage({ params: { name } }) {
  const LoadingSpinner = () => (
    <div className="flex h-screen items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <ProductInfo name={name} />
      </Suspense>

      <h3 className={`${oswald.className} p-6 pt-9 text-3xl`}>
        You May Also Like
      </h3>

      <RecommendedProducts category="men" />
    </>
  );
}
