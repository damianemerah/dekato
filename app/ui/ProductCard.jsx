import Image from "next/image";
import Link from "next/link";
import { oswald, inter } from "@/font";

export default function ProductCard({ product, className }) {
  return (
    <Link
      href="#"
      className={`mb-3 mr-3 flex w-[230px] flex-col ${oswald.className} animate_hover bg-white ${className} rounded-md`}
    >
      <div className="relative flex items-center justify-center overflow-hidden">
        <Image
          src={product?.image[0]}
          width={230}
          height={230}
          alt="product image"
          className="object-cover"
        />
      </div>
      <div className="p-2.5">
        <p className={`${inter.className} text-xs uppercase opacity-50`}>
          {product.cat}
        </p>
        <p className="mb-2 line-clamp-2 overflow-ellipsis text-lg font-light leading-5">
          {product.name}
        </p>
        <p className="text-primary">₦{product.price}</p>
      </div>
    </Link>
  );
}
