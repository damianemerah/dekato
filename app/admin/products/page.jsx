import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/app/components/spinner';
import { getAdminProduct } from '@/app/action/productAction';
import { notFound } from 'next/navigation';

const ProductsList = dynamic(
  () => import('@/app/admin/ui/products/products-list'),
  { ssr: false, loading: () => <LoadingSpinner className="min-h-screen" /> }
);

export default async function Page({ searchParams }) {
  const data = await getAdminProduct({ page: 1 });

  return <ProductsList searchParams={searchParams} data={data} />;
}
