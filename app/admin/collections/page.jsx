import dynamic from 'next/dynamic';
import { SmallSpinner } from '@/app/components/spinner';

const CollectionList = dynamic(
  () => import('@/app/admin/ui/collection/collection-list'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function Page({ searchParams }) {
  return <CollectionList searchParams={searchParams} />;
}
