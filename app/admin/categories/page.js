import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/app/components/spinner';
import { getAllCategories } from '@/app/action/categoryAction';
import { notFound } from 'next/navigation';

const CategoryContent = dynamic(
  () => import('@/app/admin/ui/category/category-content'),
  {
    ssr: false,
    loading: () => <LoadingSpinner className="min-h-screen" />,
  }
);

export default async function CategoriesPage({ searchParams }) {
  const data = await getAllCategories();

  return <CategoryContent searchParams={searchParams} data={data} />;
}
