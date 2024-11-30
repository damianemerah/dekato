import { oswald } from "@/style/font";
import Link from "next/link";
import Image from "next/image";

export default function Campaign() {
  return (
    <div className={`${oswald.className} flex flex-col gap-0.5 md:flex-row`}>
      <div className="relative aspect-square max-h-[670px] w-full lg:w-1/2">
        <Image
          src="/assets/image4.png"
          alt="New Arrivals for Men and Women"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative flex h-full flex-col items-center justify-end gap-6 pb-8">
          <h2 className="text-3xl font-medium leading-none text-white">
            New Arrivals
          </h2>
          <div className="flex w-full items-center justify-center gap-4 font-oswald">
            <Link
              href="#"
              className="bg-white px-6 py-1.5 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
              aria-label="Shop Men's Featured Collection"
            >
              Shop Men
            </Link>
            <Link
              href="#"
              className="bg-white px-6 py-1.5 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
              aria-label="Shop Women's Featured Collection"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </div>

      <div className="relative aspect-square max-h-[670px] w-full lg:w-1/2">
        <Image
          src="/assets/image5.webp"
          alt="Featured Campaign for Men and Women"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="relative flex h-full flex-col items-center justify-end gap-6 pb-8">
          <h2 className="text-3xl font-medium leading-none text-white">
            Featured Collection
          </h2>
          <div className="flex w-full items-center justify-center gap-4 font-oswald">
            <Link
              href="#"
              className="bg-white px-6 py-1.5 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
              aria-label="Shop Men's Featured Collection"
            >
              Shop Men
            </Link>
            <Link
              href="#"
              className="bg-white px-6 py-1.5 text-sm font-semibold capitalize text-primary transition-colors hover:bg-primary hover:text-white"
              aria-label="Shop Women's Featured Collection"
            >
              Shop Women
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
