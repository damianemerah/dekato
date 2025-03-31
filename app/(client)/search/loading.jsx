import { Skeleton } from '@/app/components/ui/skeleton';
import ProductCardSkeleton from '@/app/components/products/product-card-skeleton'; // Ensure this path is correct

export default function Loading() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-8">
      {/* Skeleton for the title (e.g., "Search Results for ...") */}
      <Skeleton className="mb-6 h-8 w-3/4 max-w-md" />

      {/* Skeleton for the product grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
