import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/app/components/ui/card';

export default function BlogCard({ blog }) {
  const { featuredImage, categories, publishedAt, title, excerpt, slug } =
    blog || {};
  const link = `/fashion/${slug}`;

  return (
    <Card className="group relative h-full overflow-hidden bg-white transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={featuredImage || '/placeholder.svg'}
          alt={title || 'Blog post image'}
          width={600}
          height={450}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <CardContent className="relative flex h-full flex-col p-6">
        <div className="mb-4 flex flex-col space-y-2">
          <h3 className="font-oswald line-clamp-2 text-xl font-semibold text-gray-800 sm:text-2xl">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-600">{excerpt}</p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-xs uppercase text-gray-500">
              {categories?.[0]?.name || 'Uncategorized'}
            </span>
            {publishedAt && (
              <time
                dateTime={
                  publishedAt instanceof Date
                    ? publishedAt.toISOString()
                    : publishedAt
                }
                className="text-xs text-gray-500"
              >
                {new Date(publishedAt).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                })}
              </time>
            )}
          </div>

          <Link
            href={link}
            className="group/link inline-flex items-center text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            <span className="relative">
              explore
              <span className="absolute -bottom-0.5 left-0 h-[1px] w-0 bg-gray-900 transition-all duration-300 group-hover/link:w-full" />
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
