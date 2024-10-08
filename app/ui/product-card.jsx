import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  return (
    <Link
      href={`/p/${product.slug}-${product.id}`}
      className="mb-0.5 ml-2 w-[calc(50%-8px)] md:w-[calc(33.333%-8px)] md:min-w-56 lg:w-[calc(25%-8px)]"
    >
      <div className="flex h-full flex-col bg-white text-center transition-all duration-300 hover:shadow-md">
        <div className="relative w-full overflow-hidden pb-[133.33%]">
          <Image
            src={product?.image[0] || "/placeholder-image.jpg"}
            alt={product.name}
            fill={true}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute left-0 top-0 h-full w-full object-cover object-center"
          />
          {product.discount > 0 && (
            <div className="absolute bottom-3 left-0 bg-green-500 px-2.5 py-1 text-[13px] text-white">
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col items-center pb-8 pt-1 text-[13px]">
          <p className="mb-0.5 w-full truncate overflow-ellipsis whitespace-nowrap text-nowrap text-sm capitalize">
            {product.name}
          </p>
          <div className="mb-1">
            {product.discount ? (
              <div className="flex items-center justify-center gap-2">
                <p className="font-medium text-gray-500 line-through">
                  ₦{product.price.toLocaleString()}
                </p>
                <p className="font-medium text-[#12A100]">
                  ₦{discountedPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="font-medium">₦{product.price.toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
