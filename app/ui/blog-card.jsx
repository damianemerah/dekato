import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ className, blog }) {
  const { featuredImage, categories, publishedAt, title, excerpt, slug } =
    blog || {};
  const link = `/fashion/${slug}`;
  return (
    <article
      className={`w-full ${className} flex max-w-[420px] flex-col justify-between border shadow-sm`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Link href={link || "#"} passHref>
          <Image
            src={featuredImage}
            alt={title}
            width={420}
            height={300}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      </div>
      <div
        className={`flex flex-col justify-between p-4 text-center font-oswald sm:p-6`}
      >
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span className="uppercase">{categories?.[0]?.name}</span>
          {publishedAt instanceof Date && (
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString()}
            </time>
          )}
        </div>
        <h3 className="mb-4 truncate text-lg font-bold capitalize leading-tight sm:text-xl">
          {title}
        </h3>
        <p className="mb-6 line-clamp-2 font-roboto text-sm text-gray-700 sm:text-base">
          {excerpt}
        </p>
        <div className="mt-auto flex justify-center">
          <Link href={link} passHref>
            <button
              className="inline-flex items-center justify-center border-b-2 border-b-primary px-0 text-[15px] font-semibold tracking-wider text-primary transition-colors hover:border-b-gray-400"
              aria-label="Read more about this article"
            >
              explore
            </button>
          </Link>
        </div>
      </div>
    </article>
  );
}
