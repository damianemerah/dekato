import { oswald } from "@/style/font";
import Link from "next/link";
import Image from "next/image";

export default function Campaign() {
  return (
    <div className={`${oswald.className} flex flex-col lg:flex-row`}>
      <div className="relative h-[500px] w-full lg:h-[670px] lg:w-1/2">
        <Image
          src="/assets/image4.png"
          alt="New Arrivals for Men and Women"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative flex h-full flex-col items-center justify-end gap-6 pb-10 sm:gap-8 sm:pb-16 md:gap-10 md:pb-20">
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            New Arrivals
          </h2>
          <div className="flex w-full items-center justify-center gap-4 sm:gap-6 md:gap-8">
            <Link
              href="#"
              className="bg-white px-6 py-2 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white sm:px-8 sm:py-3 sm:text-base"
              aria-label="Shop Men's New Arrivals"
            >
              Men
            </Link>
            <Link
              href="#"
              className="bg-white px-6 py-2 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white sm:px-8 sm:py-3 sm:text-base"
              aria-label="Shop Women's New Arrivals"
            >
              Women
            </Link>
          </div>
        </div>
      </div>

      <div className="relative h-[500px] w-full lg:h-[670px] lg:w-1/2">
        <Image
          src="/assets/image5.webp"
          alt="Featured Campaign for Men and Women"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative flex h-full flex-col items-center justify-end gap-6 pb-10 sm:gap-8 sm:pb-16 md:gap-10 md:pb-20">
          <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Featured Collection
          </h2>
          <div className="flex w-full items-center justify-center gap-4 sm:gap-6 md:gap-8">
            <Link
              href="#"
              className="bg-white px-8 py-2 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white sm:text-base"
              aria-label="Shop Men's Featured Collection"
            >
              Men
            </Link>
            <Link
              href="#"
              className="bg-white px-8 py-2 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white sm:text-base"
              aria-label="Shop Women's Featured Collection"
            >
              Women
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
