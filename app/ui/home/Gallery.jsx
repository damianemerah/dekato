import Image from "next/image";
import Link from "next/link";
import { oswald } from "@/style/font";

const galleryImages = [
  { src: "/assets/image5.webp", alt: "Fashion model in urban setting" },
  { src: "/assets/image5.webp", alt: "Close-up of stylish accessories" },
  {
    src: "/assets/image5.webp",
    alt: "Group shot of models in latest collection",
  },
  {
    src: "/assets/image5.webp",
    alt: "Behind the scenes at fashion photoshoot",
  },
  {
    src: "/assets/image5.webp",
    alt: "Runway model showcasing designer outfit",
  },
  {
    src: "/assets/image5.webp",
    alt: "Streetwear fashion in city environment",
  },
  { src: "/assets/image5.webp", alt: "Detail shot of haute couture dress" },
];

export default function Gallery() {
  return (
    <div className="mb-10">
      {/* <div className="mb-10 text-center"> */}
      <h2 className="py-6 font-oswald font-bold">FOLLOW OUR INSTAGRAM</h2>
      {/* <p className="mt-4 text-lg">
          <Link
            href="https://www.instagram.com/dekato_ng"
            className="mr-4 font-semibold text-primary hover:underline"
          >
            @dekato_ng
          </Link>
          <span className="text-gray-600">#dekatooutfits</span>
        </p>
      </div> */}
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 sm:gap-3">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`${
              index === 2
                ? "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2"
                : ""
            }`}
          >
            <Image
              src={image.src}
              width={500}
              height={500}
              alt={image.alt}
              loading="lazy"
              className="aspect-square w-full object-cover transition-opacity duration-300 hover:opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
