import dynamic from 'next/dynamic';
import { SmallSpinner } from '@/app/components/spinner';

const Payment = dynamic(
  () => import('@/app/components/account/payment/payment'),
  {
    ssr: false,
    loading: () => <SmallSpinner className="!text-primary" />,
  }
);

export default function PaymentPage() {
  return <Payment />;
}
