// components/ProductCard.js
import Image from "next/image";

export default function ProductCard({ product }) {
  const discountedPrice = product.discount
    ? (product.price * (100 - product.discount)) / 100
    : product.price;

  return (
    <div className="relative w-full max-w-sm flex-1 bg-white">
      <div className="relative h-[350px] w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
        {product.discount && (
          <div className="absolute left-2 top-2 bg-black px-2 py-1 text-sm text-white">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-2 pt-4">
        <h3 className="text-xs uppercase text-gray-500">{product.category}</h3>
        <p className="mt-1 text-sm font-semibold">{product.name}</p>
        {product.discount && (
          <div className="flex items-center gap-4">
            <p className="mt-1 text-lg font-bold">₦{discountedPrice}</p>
            <p className="mt-2 text-sm font-bold text-gray-500 line-through">
              ₦{product.price}
            </p>
          </div>
        )}
        {!product.discount && (
          <p className="mt-2 text-lg font-bold">₦{product.price}</p>
        )}
      </div>
    </div>
  );
}
