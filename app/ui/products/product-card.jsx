"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartOutlined, HeartFilled, CloseOutlined } from "@ant-design/icons";
import { useState, useCallback, memo } from "react";
import { useUserStore, useRecommendMutateStore } from "@/store/store";
import { addToWishlist, removeFromWishlist } from "@/app/action/userAction";
import { message } from "antd";
import { mutate } from "swr";
import { formatToNaira } from "@/utils/getFunc";
import { trackClick } from "@/utils/tracking";

const ProductCard = memo(
  ({ product, key, "data-product-id": productId, showDelete = false }) => {
    const user = useUserStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const userId = user?.id;
    const [isFavorite, setIsFavorite] = useState(
      user?.wishlist?.includes(product.id),
    );
    const setShouldMutate = useRecommendMutateStore(
      (state) => state.setShouldMutate,
    );

    const [currentImage, setCurrentImage] = useState(product?.image[0]);
    const [showVariants, setShowVariants] = useState(false);

    // Handle product click
    const handleProductClick = useCallback(async () => {
      if (!userId) return;
      await trackClick(userId, product.id);
    }, [userId, product.id]);

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

    const handleDelete = useCallback(async () => {
      try {
        const response = await fetch("/api/recommendations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (response.ok) {
          setShouldMutate(true);
        }
      } catch (error) {
        console.error(error.message);
      }
    }, [product.id, setShouldMutate]);

    const discountedPrice = product.isDiscounted
      ? product.price - (product.price * product.discount) / 100
      : product.price;

    return (
      <div className="flex h-full flex-col bg-white text-center transition-all duration-300 hover:shadow-md">
        <Link
          href={`/p/${product.slug}-${product.id}`}
          onClick={handleProductClick}
          id={`product-${product.id}`}
          data-product-id={product.id}
          key={key}
          onMouseEnter={() => {
            setShowVariants(true);
          }}
          onMouseLeave={() => {
            setShowVariants(false);
            setCurrentImage(product?.image[0]);
          }}
          className="block"
        >
          <div
            className="relative max-w-full overflow-hidden pb-[133.33%]"
            role="article"
            aria-label={`Product: ${product.name}`}
          >
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
            {userId && showDelete ? (
              <div
                className="absolute right-2 top-2 cursor-pointer text-2xl text-red-500 transition-all duration-300 hover:scale-110"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                aria-label="Delete product"
              >
                <CloseOutlined className="!text-primary" />
              </div>
            ) : (
              <div
                className={`absolute right-2 top-2 cursor-pointer text-2xl text-primary transition-all duration-300 hover:scale-110 ${isLoading ? "animate-pulse" : ""}`}
                onClick={handleFavoriteClick}
                aria-label={
                  isFavorite ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isFavorite ? <HeartFilled /> : <HeartOutlined />}
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center pb-2 pt-1 text-[13px]">
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
        </Link>
        {product?.variant?.length > 0 && (
          <div
            className={`no-scrollbar flex items-center justify-center gap-2 overflow-x-auto p-2 transition-all duration-300 ${showVariants ? "lg:visible" : "lg:invisible"} visible`}
          >
            {product?.variant?.slice(0, 5).map((variant, index) => (
              <div
                key={`${variant._id}-${index}`}
                className="h-7 w-7 flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(variant.image);
                }}
              >
                <Image
                  src={variant.image}
                  alt={`${product.name} variant ${index + 1}`}
                  width={28}
                  height={28}
                  className="h-full w-full rounded-full object-cover object-center"
                />
              </div>
            ))}
            {product?.variant?.length > 5 && (
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600">
                +{product.variant.length - 5}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
