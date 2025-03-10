import { Suspense } from 'react';
import Hero from '@/app/components/home/hero';
import SelectedCategoriesSkeleton from '@/app/components/home/selected-categories-skeleton';
import RecommendedProductsSkeleton from '@/app/components/recommended-products-skeleton';
import BelowFoldSkeleton from '@/app/components/home/below-fold-skeleton';

// Dynamic imports with suspense boundaries
import SelectedCategories from '@/app/components/home/selected-categories';
import RecommendProduct from '@/app/components/home/recommend-product';
import BelowFold from '@/app/components/home/below-fold';

export const metadata = {
  title: 'Dekato Outfit | Fashion & Lifestyle',
  description:
    'Discover the latest fashion trends and lifestyle products at Dekato Outfit. Shop our curated collection of clothing, accessories, and more.',
  openGraph: {
    title: 'Dekato Outfit | Fashion & Lifestyle',
    description:
      'Discover the latest fashion trends and lifestyle products at Dekato Outfit.',
    images: [
      {
        url: '/assets/image5.webp',
        width: 1200,
        height: 630,
        alt: 'Dekato Outfit',
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="font-oswald bg-gray-100">
      {/* Hero is statically rendered */}
      <Hero />

      {/* Categories with suspense boundary */}
      <Suspense fallback={<SelectedCategoriesSkeleton />}>
        <SelectedCategories />
      </Suspense>

      {/* Recommended products with suspense boundary */}
      <Suspense fallback={<RecommendedProductsSkeleton />}>
        <RecommendProduct />
      </Suspense>

      {/* Below fold content with suspense boundary */}
      <Suspense fallback={<BelowFoldSkeleton />}>
        <BelowFold />
      </Suspense>
    </div>
  );
}
