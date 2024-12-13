import { notFound } from "next/navigation";
import Image from "next/image";
import { getBlogBySlug } from "@/app/action/blogAction";

export default async function BlogDetailPage({ params }) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          {blog.categories?.map((category) => (
            <span key={category.id}>{category.name}</span>
          ))}
          <span>•</span>
          <time dateTime={blog.createdAt}>
            {new Date(blog.createdAt).toLocaleDateString()}
          </time>
        </div>
        <h1 className="mb-4 text-4xl font-bold">{blog.title}</h1>
        <p className="text-xl text-gray-600">{blog.excerpt}</p>
      </header>

      {/* Featured Image */}
      <div className="relative mb-12 aspect-[16/9] w-full overflow-hidden rounded-lg">
        <Image
          src={blog.featuredImage}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div
        className="prose prose-lg mx-auto max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Author */}
      {blog.author && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold">{blog.author}</h2>
              <p className="text-gray-600">Author</p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
  };
}
