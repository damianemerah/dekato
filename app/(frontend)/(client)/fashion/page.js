import { getAllBlogs } from "@/app/action/blogAction";
import BlogCard from "@/app/ui/blog-card";
import { LoadingSpinner } from "@/app/ui/spinner";
import { Suspense } from "react";

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
        <div className="mb-4 h-6 w-full animate-pulse rounded bg-gray-200" />
        <div className="mb-6 h-16 w-full animate-pulse rounded bg-gray-200" />
        <div className="mt-auto flex justify-center">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

async function BlogList({ searchParams }) {
  const blogs = await getAllBlogs({
    page: searchParams?.page || 1,
    limit: 12,
    status: "published",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-center text-4xl font-bold">Fashion Blog</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
