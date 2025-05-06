import { LoadingSpinner } from '@/app/components/spinner';
import dynamic from 'next/dynamic';

const CategoryForm = dynamic(
  () => import('@/app/admin/ui/category/category-form'),
  {
    ssr: false,
    loading: () => <LoadingSpinner className="min-h-screen" />,
  }
);

export default function CategoryPage({ params }) {
  return <CategoryForm categoryId={params.slug} />;
}
