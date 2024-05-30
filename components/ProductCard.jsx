import Image from "next/image";
import Link from "next/link";
import image3 from "@/public/assets/image3.png";
import { oswald, inter } from "@/font";

export default function ProductCard() {
  return (
    <Link
      href="#"
      className={`flex flex-col w-64 mr-3 mb-3 ${oswald.className} animate_hover`}
    >
      <div className="flex justify-center shrink-0 overflow-hidden relative ">
        <Image
          src={image3}
          width="100%"
          height="100%"
          alt="product image"
          className="block object-cover"
        />
      </div>
      <div className="p-2">
        <p className={`${inter.className} opacity-50 text-xs uppercase `}>
          Product Category
        </p>
        <p className="text-lg font-light mb-2">
          Angels malu zip jeans slim black used
        </p>
        <p>₦13,900 EUR</p>
      </div>
    </Link>
  );
}
