import Image from "next/image";
import Link from "next/link";
import { oswald, inter } from "@/font";

export default function ProductCard({ product, className }) {
  return (
    <Link
      href="#"
      className={`flex flex-col w-[230px] mr-3 mb-3 ${oswald.className} animate_hover bg-white ${className} rounded-md`}
    >
      <div className="overflow-hidden relative flex items-center justify-center">
        <Image
          src={product?.image[0]}
          width={230}
          height={230}
          alt="product image"
          className="object-cover"
        />
      </div>
      <div className="p-2.5">
        <p className={`${inter.className} opacity-50 text-xs uppercase `}>
          {product.cat}
        </p>
        <p className="text-lg leading-5 font-light mb-2 overflow-ellipsis line-clamp-2">
          {product.name}
        </p>
        <p className="text-primary">₦{product.price}</p>
      </div>
    </Link>
  );
}
