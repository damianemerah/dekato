import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const discountedPrice = product.discount
    ? (product.price * (100 - product.discount)) / 100
    : product.price;

  return (
    <Link href={`/product/${product.slug}-${product.id}`}>
      <div className="relative w-full max-w-sm bg-white">
        <div className="relative h-[400px] w-full overflow-hidden">
          <Image
            src={product?.image[0]}
            alt={product.name}
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
          />
          {product.discount > 0 && (
            <div className="absolute left-2 top-2 bg-black px-2 py-1 text-sm text-white">
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="p-2">
          {/* <h3 className="text-xs uppercase text-gray-500">
          {product.cat.join(", ")}
        </h3> */}
          {product.slug && (
            <p className="mt-1 line-clamp-2 text-sm font-light text-[#303030]">
              {product.name}
            </p>
          )}
          {product.discount > 0 && (
            <div className="flex items-center gap-2">
              <p className="mt-2 text-sm font-semibold text-gray-500 line-through">
                ₦{product.price}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#12A100]">
                ₦{discountedPrice}
              </p>
            </div>
          )}
          {!product.discount && (
            <p className="mt-2 text-sm font-semibold">₦{product.price}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
