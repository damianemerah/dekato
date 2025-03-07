import Hero from '@/app/components/home/Hero';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/app/components/spinner';
import RecommendedProductsSkeleton from '@/app/components/recommended-products-skeleton';
const BelowFold = dynamic(() => import('@/app/components/home/below-fold'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const RecommendProduct = dynamic(
  () => import('@/app/components/home/recommend-product'),
  {
    loading: () => <RecommendedProductsSkeleton />,
    ssr: false,
  }
);

const SelectedCategories = dynamic(
  () => import('@/app/components/home/selected-categories'),
  {
    loading: () => <LoadingSpinner className="min-h-[400px]" />,
    ssr: false,
  }
);

export default function Home() {
  return (
    <div className="font-oswald bg-gray-100">
      <Hero />
      <>
        <SelectedCategories />
        <RecommendProduct />
      </>
      <BelowFold />
    </div>
  );
}
