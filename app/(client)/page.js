import Hero from '@/app/components/home/hero';
import SelectedCategories from '@/app/components/home/selected-categories';
import Blog from '@/app/components/home/blog';
import Campaign from '@/app/components/home/Campaign';
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { auth } from '@/app/lib/auth';
import { getRecommendations } from '@/app/action/recommendationAction';
import RecommendedProductsClient from '@/app/components/recommended-products-client';
import RecommendedProductsSkeleton from '@/app/components/recommended-products-skeleton';
import Gallery from '@/app/components/home/gallery';

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

export default async function Home() {
  // Get user session
  const session = await auth();
  const userId = session?.user?.id;

  // Get selected category from cookie
  const cookieStore = cookies();
  const selectedCategory =
    cookieStore.get('selected-category')?.value || 'women';

  // Determine recommendation type based on user authentication
  const recommendationType = userId ? 'personalized' : 'general';

  // Get the recommended products from the server
  const recommendedProducts = await getRecommendations(
    recommendationType,
    selectedCategory
  );

  return (
    <div className="bg-background font-oswald">
      {/* Hero is statically rendered */}
      <Hero />

      {/* Categories rendered directly from server component */}
      <SelectedCategories />

      {/* Home recommended products */}
      <Suspense fallback={<RecommendedProductsSkeleton />}>
        <RecommendedProductsClient
          initialProducts={recommendedProducts}
          category={selectedCategory}
        />
      </Suspense>

      {/* Campaign section */}
      <Campaign />

      {/* Below fold content rendered directly */}
      <Blog />
      <Gallery />
    </div>
  );
}
