import Image from "next/image";
import image5 from "@/public/assets/image5.webp";
import Link from "next/link";

export default function Galley() {
  return (
    <div className="mb-10">
      <div className="mb-10 text-center">
        <h2>FOLLOW OUR INSTAGRAM</h2>
        <p>
          <Link href="#" className="mr-4">
            @dekato_ng
          </Link>
          <span>#dekatooutfits</span>
        </p>
      </div>
      <div className="grid grid-cols-5 gap-5 max-md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Image
            src={image5}
            width="100%"
            height="100%"
            alt="Product Image"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <Image
            src={image5}
            width="100%"
            height="100%"
            alt="Product Image"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-6">
          <Image
            src={image5}
            width="100%"
            height="100%"
            alt="Product Image"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <Image
            src={image5}
            width="100%"
            height="100%"
            alt="Product Image"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="col-span-2 max-md:col-span-2">
          <Image
            src={image5}
            width="100%"
            height="100%"
            alt="Product Image"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-6 max-md:flex-row">
          <Image
            src={image5}
            width="100%"
            height="100%"
            alt="Product Image"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <Image
            src={image5}
            width="100%"
            height="100%"
            alt="Product Image"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
