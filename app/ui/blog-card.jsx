import { oswald, roboto } from "@/style/font";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ className, blog }) {
  console.log(blog);
  const { featuredImage, categories, publishedAt, title, excerpt, slug } =
    blog || {};
  const link = `/fashion/${slug}`;
  return (
    <article
      className={`flex w-full flex-shrink-0 flex-grow-0 flex-col ${className} shadow-sm`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Link href={link || "#"} passHref>
          <Image
            src={featuredImage}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
            priority={true}
          />
        </Link>
      </div>
      <div className={`${oswald.className} flex flex-col p-4 sm:p-6`}>
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span className="uppercase">{categories?.[0]?.name}</span>
          {publishedAt instanceof Date && (
            <time dateTime={publishedAt}>
              {new Date(publishedAt).toLocaleDateString()}
            </time>
          )}
        </div>
        <h3 className="mb-4 truncate text-center text-lg font-bold uppercase leading-tight sm:text-xl">
          {title}
        </h3>
        <p
          className={`${roboto.className} mb-6 line-clamp-2 text-center text-sm text-gray-700 sm:text-base`}
        >
          {excerpt}
        </p>
        <Link href={link} passHref className="text-center">
          <button
            className="mt-auto inline-flex items-center justify-center border-b-2 border-b-primary px-0 text-sm font-semibold text-primary transition-colors hover:border-b-gray-800"
            aria-label="Read more about this article !py-0"
          >
            Read more
          </button>
        </Link>
      </div>
    </article>
  );
}
