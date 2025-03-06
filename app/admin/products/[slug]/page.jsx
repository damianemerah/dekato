'use client';

import dynamic from 'next/dynamic';
import { SmallSpinner } from '@/app/components/spinner';

const ProductContent = dynamic(
  () => import('@/app/admin/ui/products/products-content'),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

function LoadingSpinner() {
  return (
    <div className="flex min-h-40 w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function ProductContentPage({ params: { slug } }) {
  return <ProductContent slug={slug} />;
}
