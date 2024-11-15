import { LoadingSpinner } from "@/app/ui/spinner";
import ProductInfo from "./product-content";
import { Suspense } from "react";

export default function ProductInfoPage({ params: { name } }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductInfo name={name} />
    </Suspense>
  );
}
