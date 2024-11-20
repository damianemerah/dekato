"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useState, useEffect, useCallback, memo } from "react";
import { useUserStore } from "@/store/store";
import { addToWishlist, removeFromWishlist } from "@/app/action/userAction";
import { message } from "antd";
import { mutate } from "swr";
import { formatToNaira } from "@/utils/getFunc";

const ProductCard = memo(({ product }) => {
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const userId = user?.id;
  const [isFavorite, setIsFavorite] = useState(
    user?.wishlist?.includes(product.id),
  );
  const [currentImage, setCurrentImage] = useState(product?.image[0]);
  const [showVariants, setShowVariants] = useState(false);

  useEffect(() => {
    if (user?.wishlist?.length < 0) return;
    setIsFavorite(user?.wishlist?.includes(product.id));
  }, [user?.wishlist, product.id]);

  const handleFavoriteClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsLoading(true);

      if (!userId) {
        message.error("Please login to add to wishlist");
        return;
      }

      try {
        if (isFavorite) {
          await removeFromWishlist(userId, product.id);
          message.success("Removed from wishlist");
        } else {
          await addToWishlist(userId, product.id);
          message.success("Added to wishlist");
        }
        setIsFavorite(!isFavorite);
        await mutate(`/api/user/${userId}`);
      } catch (error) {
        message.error(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [isFavorite, userId, product.id],
  );

  const discountedPrice = product.isDiscounted
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  return (
    <Link
      href={`/p/${product.slug}-${product.id}`}
      className="mb-0.5 ml-2.5 w-[calc(50%-10px)] md:w-[calc(33.333%-10px)] md:min-w-56 lg:w-[calc(25%-10px)]"
      onMouseEnter={() => setShowVariants(true)}
      onMouseLeave={() => {
        setShowVariants(false);
        setCurrentImage(product?.image[0]);
      }}
    >
      <div className="flex h-full flex-col bg-white text-center transition-all duration-300 hover:shadow-md">
        <div className="relative max-w-full overflow-hidden pb-[133.33%]">
          <Image
            src={currentImage || "/placeholder-image.jpg"}
            alt={product.name}
            fill={true}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:..."
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute left-0 top-0 block h-full w-full object-cover object-center transition-opacity duration-300"
          />
          {product.isDiscounted && (
            <div className="absolute bottom-3 left-0 bg-red-500 px-3 py-0.5 text-[13px] text-white">
              -{product.discount}%
            </div>
          )}
          <div
            className={`absolute right-2 top-2 cursor-pointer text-2xl text-primary transition-all duration-300 hover:scale-110 ${isLoading ? "animate-pulse" : ""}`}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? <HeartFilled /> : <HeartOutlined />}
          </div>
          {showVariants && product?.variant?.length > 0 && (
            <div className="no-scrollbar absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 overflow-auto bg-white/80 p-2 transition-all duration-300">
              {product?.variant?.map((variant) => (
                <div
                  key={variant.id}
                  className="h-7 w-7 cursor-pointer transition-transform hover:scale-110"
                  onMouseEnter={() => setCurrentImage(variant.image)}
                  onMouseLeave={() => setCurrentImage(product?.image[0])}
                >
                  <Image
                    src={variant.image}
                    alt={product.name}
                    width={28}
                    height={28}
                    className="h-full w-full rounded-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col items-center pb-4 pt-1 text-[13px]">
          <p className="mb-0.5 w-full truncate overflow-ellipsis whitespace-nowrap text-nowrap text-sm capitalize">
            {product.name}
          </p>
          <div className="mb-1">
            {product.isDiscounted ? (
              <div className="flex items-center justify-center gap-2 text-[15px]">
                <p className="font-medium text-gray-500 line-through">
                  {formatToNaira(product.price)}
                </p>
                <p className="font-medium text-primary">
                  {formatToNaira(discountedPrice)}
                </p>
              </div>
            ) : (
              <p className="text-[15px] font-medium">
                {formatToNaira(product.price)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
