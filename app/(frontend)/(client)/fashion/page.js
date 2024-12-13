import { getAllBlogs } from "@/app/action/blogAction";
import BlogCard from "@/app/ui/blog-card";
import { LoadingSpinner } from "@/app/ui/spinner";
import { Suspense } from "react";

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
          <BlogCard
            key={blog.id}
            blog={blog}
          />
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
    <Suspense fallback={<LoadingSpinner className="min-h-screen" />}>
      <BlogList searchParams={searchParams} />
    </Suspense>
  );
}
