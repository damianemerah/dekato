import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/app/components/spinner';
import { getAllUsers } from '@/app/action/userAction';

const CustomerList = dynamic(
  () => import('@/app/admin/ui/customers/customers-list'),
  {
    loading: () => <LoadingSpinner className="min-h-screen" />,
    ssr: false,
  }
);

export default async function CustomerPage({ searchParams }) {
  const data = await getAllUsers({ page: 1 });
  return <CustomerList data={data} searchParams={searchParams} />;
}
