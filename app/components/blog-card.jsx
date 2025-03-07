import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/app/components/ui/card';

export default function BlogCard({ blog }) {
  const { featuredImage, categories, publishedAt, title, excerpt, slug } =
    blog || {};
  const link = `/fashion/${slug}`;

  return (
    <Card className="h-full overflow-hidden">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Link href={link || '#'} passHref>
          <Image
            src={featuredImage || '/placeholder.svg'}
            alt={title}
            width={420}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>
      <CardHeader className="font-oswald px-4 pb-0 pt-4 text-center sm:px-6">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span className="uppercase">{categories?.[0]?.name}</span>
          {publishedAt instanceof Date && (
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString()}
            </time>
          )}
        </div>
        <h3 className="mb-2 truncate text-lg font-bold capitalize leading-tight sm:text-xl">
          {title}
        </h3>
      </CardHeader>
      <CardContent className="font-oswald px-4 py-2 text-center sm:px-6">
        <p className="font-roboto line-clamp-2 text-sm text-gray-700 sm:text-base">
          {excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex justify-center px-4 pb-4 pt-2 sm:px-6">
        <Link href={link} passHref>
          <button
            className="inline-flex items-center justify-center border-b-2 border-b-primary px-0 text-[15px] font-semibold tracking-wider text-primary transition-colors hover:border-b-gray-400"
            aria-label="Read more about this article"
          >
            explore
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}
