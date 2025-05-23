import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getBlogBySlug } from '@/app/action/blogAction';

export const revalidate = 3600; // 1 hour

export async function generateMetadata({ params }) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog || blog?.error) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found',
      robots: {
        index: false,
      },
    };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: blog.author ? [blog.author] : undefined,
      images: [
        { url: blog.featuredImage, width: 1200, height: 630, alt: blog.title },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      images: [blog.featuredImage],
    },
    alternates: {
      canonical: `/fashion/${params.slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog || blog?.error) {
    notFound();
  }

  // Structured data for blog post
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.featuredImage,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    author: { '@type': 'Person', name: blog.author || 'Dekato Outfit' },
    publisher: {
      '@type': 'Organization',
      name: 'Dekato Outfit',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXTAUTH_URL}/assets/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXTAUTH_URL}/fashion/${blog.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-600">
            {blog.categories?.map((category) => (
              <span
                key={category.id}
                className="rounded-full bg-gray-100 px-3 py-1"
              >
                {category.name || 'Uncategorized'}
              </span>
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
        <div className="relative mb-12 w-full overflow-hidden rounded-lg">
          <div className="aspect-video w-full">
            <Image
              src={blog.featuredImage || '/placeholder.svg'}
              alt={blog.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
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
    </>
  );
}
