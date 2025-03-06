import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/app/components/spinner';

const OrdersList = dynamic(() => import('@/app/admin/ui/orders/order-list'), {
  ssr: false,
  loading: () => <LoadingSpinner className="min-h-screen" />,
});

export default function Page({ searchParams }) {
  return <OrdersList searchParams={searchParams} />;
}
