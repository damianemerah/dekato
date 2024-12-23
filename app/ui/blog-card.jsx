import { oswald, roboto } from "@/style/font";
import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";

export default function BlogCard({ className, blog }) {
  const { featuredImage, categories, publishedAt, title, excerpt, slug } =
    blog || {};
  const link = `/fashion/${slug}`;
  return (
    <article
      className={`flex w-full flex-shrink-0 flex-grow-0 flex-col ${className}`}
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
          <time dateTime={publishedAt}>{publishedAt}</time>
        </div>
        <h3 className="mb-4 truncate text-center text-lg font-bold uppercase leading-tight sm:text-xl">
          {title}
        </h3>
        <p
          className={`${roboto.className} mb-6 line-clamp-2 text-center text-sm text-gray-700 sm:text-base`}
        >
          {excerpt}
        </p>
        <Link href={link} passHref>
          <Button
            className="mt-auto inline-flex items-center justify-center bg-black px-4 py-2 text-sm font-semibold uppercase text-white transition-colors hover:bg-gray-800 sm:px-6"
            aria-label="Read more about this article"
          >
            Read More
          </Button>
        </Link>
      </div>
    </article>
  );
}
