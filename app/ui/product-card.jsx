import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  return (
    <Link href={`/product/${product.slug}-${product.id}`}>
      <div className="flex h-full flex-col bg-white shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={product?.image[0] || "/placeholder-image.jpg"}
            alt={product.name}
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover"
          />
          {product.discount > 0 && (
            <div className="absolute bottom-3 left-0 bg-black px-2 py-2 text-sm text-white">
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-3">
          <div className="mb-1">
            {product.discount ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-500 line-through">
                  ₦{product.price.toLocaleString()}
                </p>
                <p className="font-semibold text-[#12A100]">
                  ₦{discountedPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="font-semibold">₦{product.price.toLocaleString()}</p>
            )}
          </div>
          <p className="line-clamp-2 text-sm">{product.name}</p>
        </div>
      </div>
    </Link>
  );
}
