import Image from "next/image";
import Link from "next/link";
import { oswald, inter } from "@/font";

export default function ProductCard({ product, className }) {
  return (
    <Link
      href="#"
      className={`mb-3 mr-3 flex h-[300px] w-[230px] flex-col justify-between ${oswald.className} animate_hover bg-white ${className} rounded-md`}
    >
      <div className="relative flex h-[230px] w-[230px] items-center justify-center overflow-hidden rounded-t-md">
        <Image
          src={product?.image[0]}
          width={230}
          height={250}
          alt="product image"
          className="object-cover"
        />
      </div>
      <div className="mt-auto p-2.5">
        <p className={`${inter.className} text-xs uppercase opacity-50`}>
          {product?.cat}
        </p>
        <p className="mb-2 line-clamp-2 overflow-ellipsis text-lg font-light leading-6">
          {product?.description}
        </p>
        <p>₦{product?.price}</p>
      </div>
    </Link>
  );
}
