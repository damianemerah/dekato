import ProductCardSkeleton from "./products/product-card-skeleton";

export default function RecommendedProductsSkeleton() {
  return (
    <div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex justify-center md:justify-start">
        <div className="h-8 w-48 animate-pulse bg-gray-200" />
      </div>
      <div className="mx-auto grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
