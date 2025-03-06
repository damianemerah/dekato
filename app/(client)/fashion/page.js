import { getAllBlogs } from '@/app/action/blogAction';
import BlogCard from '@/app/components/blog-card';
import { LoadingSpinner } from '@/app/components/spinner';
import { Suspense } from 'react';

function BlogSkeleton() {
  return (
    <div className="flex w-full flex-shrink-0 flex-grow-0 flex-col shadow-sm">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <div className="h-full w-full animate-pulse bg-gray-200" />
      </div>
      <div className="flex flex-col p-4 sm:p-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mb-3 h-6 w-full animate-pulse rounded bg-gray-200" />
        <div className="mb-4 h-16 w-full animate-pulse rounded bg-gray-200" />
        <div className="mt-auto flex justify-center">
          <div className="h-8 w-28 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

async function BlogList({ searchParams }) {
  const blogs = await getAllBlogs({
    page: searchParams?.page || 1,
    limit: 12,
    status: 'published',
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <h1 className={`mb-8 text-center font-oswald text-4xl font-bold`}>
        Fashion Blog
      </h1>
      <div className="mx-auto flex flex-wrap justify-center gap-8">
        {blogs?.data?.map((blog) => (
          <Suspense key={blog.id} fallback={<BlogSkeleton />}>
            <BlogCard blog={blog} />
          </Suspense>
        ))}
      </div>
      {blogs?.data?.length === 0 && (
        <p className="text-center text-gray-500">No blog posts found.</p>
      )}
    </div>
  );
}

export default function FashionPage({ searchParams }) {
  return (
    <main>
      <Suspense fallback={<LoadingSpinner />}>
        <BlogList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

export const metadata = {
  title: 'Fashion Blog | Latest Style Trends & Tips',
  description:
    'Explore our fashion blog for the latest style trends, tips, and fashion inspiration. Stay updated with the newest collections and fashion insights.',
  openGraph: {
    title: 'Fashion Blog | Latest Style Trends & Tips',
    description:
      'Explore our fashion blog for the latest style trends, tips, and fashion inspiration.',
    type: 'website',
    images: [
      {
        url: '/assests/image5.png',
        width: 1200,
        height: 630,
        alt: 'Fashion Blog',
      },
    ],
  },
};
