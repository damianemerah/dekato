import Image from "next/image";
import image5 from "@/public/assets/image5.png";
import Link from "next/link";

export default function Galley() {
  return (
    <div className="mb-10 px-5">
      <div className="mb-10 text-center">
        <h2>FOLLOW OUR INSTAGRAM</h2>
        <p>
          <Link href="#" className="mr-4">
            @dekato_ng
          </Link>
          <span>#dekatooutfits</span>
        </p>
      </div>
      <div className="flex gap-0 max-md:flex-col max-md:gap-0">
        <div className="flex w-1/5 flex-col max-md:ml-0 max-md:w-full">
          <div className="flex grow flex-col max-md:mt-6">
            <Image
              src={image5}
              alt="Product Image"
              loading="lazy"
              className="block aspect-square h-full w-full"
            />
            <Image
              src={image5}
              alt="Product Image"
              loading="lazy"
              className="mt-6 block aspect-square h-full w-full"
            />
          </div>
        </div>
        <div className="ml-5 flex w-1/5 flex-col max-md:ml-0 max-md:w-full">
          <div className="flex grow flex-col max-md:mt-6">
            <Image
              src={image5}
              alt="Product Image"
              loading="lazy"
              className="block aspect-square h-full w-full"
            />
            <Image
              src={image5}
              alt="Product Image"
              loading="lazy"
              className="mt-6 block aspect-square h-full w-full"
            />
          </div>
        </div>
        <div className="ml-5 flex w-[41%] flex-col max-md:ml-0 max-md:w-full">
          <Image
            src={image5}
            alt="Product Image"
            loading="lazy"
            className="cover block aspect-square h-full w-full max-md:mt-6 max-md:max-w-full"
          />
        </div>
        <div className="ml-5 flex w-1/5 flex-col max-md:ml-0 max-md:w-full">
          <div className="flex grow flex-col max-md:mt-6">
            <Image
              src={image5}
              alt="Product Image"
              loading="lazy"
              className="block aspect-square h-full w-full"
            />
            <Image
              src={image5}
              alt="Product Image"
              loading="lazy"
              className="mt-6 block aspect-square h-full w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
