import dynamic from 'next/dynamic';
import { SmallSpinner } from '@/app/components/spinner';
import { getBlog } from '@/app/action/blogAction';
import { notFound } from 'next/navigation';

const BlogForm = dynamic(() => import('@/app/admin/ui/blog/blog-form'), {
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

export default async function BlogPage({ params }) {
  const { id } = params;
  let blog = null;

  if (id !== 'new') {
    blog = await getBlog(id);
  }

  if (!blog || blog?.error) {
    notFound();
  }

  return <BlogForm initialData={blog} />;
}
