import Image from "next/image";
import image5 from "@/public/assets/image5.png";
import Link from "next/link";

export default function Galley() {
  const images = Array(8).fill(image5);

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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`${
              index === 4
                ? "col-span-2 row-span-2 sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-2"
                : ""
            }`}
          >
            <Image
              src={image}
              alt={`Product Image ${index + 1}`}
              loading="lazy"
              className="block aspect-square h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
