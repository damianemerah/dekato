import RecommendedProducts from "@/app/ui/recommended-products";
import CategoryPage from "./CategoryPage";
import { Suspense } from "react";
import { oswald } from "@/style/font";
import { SmallSpinner } from "@/app/ui/spinner";

export default function CategoryPageCy({ params: { name } }) {
  const LoadingSpinner = () => (
    <div className="flex h-screen items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <CategoryPage name={name} />
      </Suspense>

      <div className="mb-10 mt-20 px-10">
        <h3 className={`${oswald.className} p-6 pt-9 text-3xl`}>
          You May Also Like
        </h3>

        <RecommendedProducts category="men" />
      </div>
    </>
  );
}
