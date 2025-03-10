import dynamic from 'next/dynamic';
import { SmallSpinner } from '@/app/components/spinner';

const AccountContent = dynamic(
  () => import('@/app/components/account/account-content'),
  {
    ssr: false,
    loading: () => <SmallSpinner className="!text-primary" />,
  }
);

export default function AccountPage() {
  return <AccountContent />;
}
