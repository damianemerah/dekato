import dynamic from 'next/dynamic';
import { SmallSpinner } from '@/app/components/spinner';

const Wishlist = dynamic(
  () => import('@/app/components/account/wishlist/wishlists'),
  {
    ssr: false,
    loading: () => <SmallSpinner className="!text-primary" />,
  }
);

export default function WishlistPage() {
  return <Wishlist />;
}
