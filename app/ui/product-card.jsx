import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  return (
    <Link href={`/product/${product.slug}-${product.id}`}>
      <div className="flex h-full flex-col bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={product?.image[0] || "/placeholder-image.jpg"}
            alt={product.name}
            fill={true}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-110"
          />
          {product.discount > 0 && (
            <div className="absolute left-2 top-2 bg-red-600 px-2 py-1 text-sm text-white">
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between p-4 text-center">
          <div>
            <p className="mb-2 line-clamp-2 text-sm font-medium text-gray-800 opacity-70">
              {product.name}
            </p>
          </div>
          <div>
            {product.discount ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold tracking-wider text-gray-400 line-through">
                  ₦{product.price.toLocaleString()}
                </p>
                <p className="text-sm font-bold tracking-wider text-green-600">
                  ₦{discountedPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm font-bold tracking-wider text-gray-800">
                ₦{product.price.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
