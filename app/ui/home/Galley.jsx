import Image from "next/image";
import image5 from "@/public/assets/image5.png";
import Link from "next/link";

export default function Galley() {
  return (
    <div className="mb-10">
      <div className="text-center mb-10">
        <h2>FOLLOW OUR INSTAGRAM</h2>
        <p>
          <Link href="#" className=" mr-4">
            @dekato_ng
          </Link>
          <span>#dekatooutfits</span>
        </p>
      </div>
      <div className="flex gap-0 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-1/5 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow max-md:mt-6">
            <Image
              src={image5}
              width="100%"
              height="100%"
              alt="Product Image"
              loading="lazy"
              className="block w-full h-full aspect-square"
            />
            <Image
              src={image5}
              width="100%"
              height="100%"
              alt="Product Image"
              loading="lazy"
              className="block h-full mt-6 w-full aspect-square"
            />
          </div>
        </div>
        <div className="flex flex-col ml-5 w-1/5 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow max-md:mt-6">
            <Image
              src={image5}
              width="100%"
              height="100%"
              alt="Product Image"
              loading="lazy"
              className="block h-full w-full aspect-square"
            />
            <Image
              src={image5}
              width="100%"
              height="100%"
              alt="Product Image"
              loading="lazy"
              className="block mt-6 h-full w-full aspect-square"
            />
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[41%] max-md:ml-0 max-md:w-full">
          <Image
            src={image5}
            width="100%"
            height="100%"
            alt="Product Image"
            loading="lazy"
            className="block cover w-full h-full aspect-square max-md:mt-6 max-md:max-w-full"
          />
        </div>
        <div className="flex flex-col ml-5 w-1/5 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow max-md:mt-6">
            <Image
              src={image5}
              width="100%"
              height="100%"
              alt="Product Image"
              loading="lazy"
              className="block w-full h-full aspect-square"
            />
            <Image
              src={image5}
              width="100%"
              height="100%"
              alt="Product Image"
              loading="lazy"
              className="block mt-6 w-full h-full aspect-square"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
