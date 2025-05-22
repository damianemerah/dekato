import dynamic from 'next/dynamic';
import { SmallSpinner } from '@/app/components/spinner';

const BlogList = dynamic(() => import('@/app/admin/ui/blog/blog-list'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

function LoadingSpinner() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function BlogsPage({ searchParams }) {
  return <BlogList searchParams={searchParams} />;
}
