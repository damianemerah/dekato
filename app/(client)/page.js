import Hero from '@/app/components/home/hero';
import SelectedCategories from '@/app/components/home/selected-categories';
import RecommendProductServerWrapper from '@/app/components/home/recommend-product-server';
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

export default async function Home() {
  return (
    <div className="bg-gray-100 font-oswald">
      {/* Hero is statically rendered */}
      <Hero />

      {/* Categories rendered directly from server component */}
      <SelectedCategories />

      {/* Recommended products handled by server component wrapper */}
      <RecommendProductServerWrapper />

      {/* Below fold content rendered directly */}
      <BelowFold />
    </div>
  );
}
