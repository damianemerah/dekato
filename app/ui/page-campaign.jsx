import { oswald, roboto } from "@/style/font";
import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";
import image6 from "@/public/assets/image6.png";

export default function BlogCard({
  className,
  image,
  category,
  date,
  title,
  excerpt,
  link,
}) {
  const now = new Date();
  return (
    <article
      className={`flex w-full flex-shrink-0 flex-grow-0 flex-col ${className}`}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={image || image6}
          alt={title || "blog image"}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
          priority={true}
        />
      </div>
      <div className={`${oswald.className} flex flex-col p-4 sm:p-6`}>
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span className="uppercase">{category}</span>
          <time dateTime={date}>{date || now.toLocaleDateString()}</time>
        </div>
        <h3 className="mb-4 text-lg font-bold uppercase leading-tight sm:text-xl md:text-2xl">
          {title || "EXPLORE THE BEST OF YOU"}
        </h3>
        <p
          className={`${roboto.className} mb-6 text-sm text-gray-700 sm:text-base`}
        >
          {excerpt ||
            "You can choose the best option for you, and it does not matter whether you are in Prague or San Francisco."}
        </p>
        <Link href={link || "#"} passHref>
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
