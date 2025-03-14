"use client";

import Image from "next/image";
import Link from "next/link";
import {
  HeartOutlined,
  HeartFilled,
  CloseOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useState, useCallback, memo, useEffect } from "react";
import { useUserStore, useRecommendMutateStore } from "@/app/store/store";
import { addToWishlist, removeFromWishlist } from "@/app/action/userAction";
import { message } from "antd";
import { mutate } from "swr";
import { formatToNaira } from "@/app/utils/getFunc";
import { trackClick } from "@/app/utils/tracking";
import { createCartItem } from "@/app/action/cartAction";

const ProductCard = memo(({ product, key, showDelete = false }) => {
  const [supportsHover, setSupportsHover] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const userId = user?.id;
  const [isFavorite, setIsFavorite] = useState(
    user?.wishlist?.includes(product.id)
  );
  const setShouldMutate = useRecommendMutateStore(
    (state) => state.setShouldMutate
  );

  const [currentImage, setCurrentImage] = useState(product?.image[0]);
  const [variantImages, setVariantImages] = useState([]);

  useEffect(() => {
    setCurrentImage(product?.image[0]);
    setVariantImages(product?.variant?.map((variant) => variant.image));
  }, [product]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    const screenQuery = window.matchMedia("(min-width: 640px)");

    const updateMediaQueries = () => {
      setSupportsHover(mediaQuery.matches);
      setIsSmallScreen(!screenQuery.matches);
    };

    updateMediaQueries();

    mediaQuery.addEventListener("change", updateMediaQueries);
    screenQuery.addEventListener("change", updateMediaQueries);

    return () => {
      mediaQuery.removeEventListener("change", updateMediaQueries);
      screenQuery.removeEventListener("change", updateMediaQueries);
    };
  }, []);

  // Handle product click
  const handleProductClick = useCallback(async () => {
    if (!userId) return;
    await trackClick(userId, product.id);
  }, [userId, product.id]);

  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!userId) {
        message.error("Please login to add to cart");
        return;
      }

      try {
        setIsAddingToCart(true);
        const newItem = {
          product: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image[0],
          userId,
        };

        await createCartItem(userId, newItem);
        await mutate(`/api/user/${userId}`);
        await mutate(`/cart/${userId}`);
        message.success("Item added to cart");
      } catch (error) {
        message.info(error.message, 4);
      } finally {
        setIsAddingToCart(false);
      }
    },
    [userId, product]
  );

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
    [isFavorite, userId, product.id]
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

  const shouldShowVariantsOnHover = supportsHover && !isSmallScreen;

  return (
    <div
      className="group relative flex h-full flex-col bg-white text-center transition-all duration-300 hover:border"
      onMouseLeave={() => {
        setCurrentImage(product?.image[0]);
      }}
    >
      <Link
        href={`/product/${product.slug}-${product.id}`}
        onClick={handleProductClick}
        id={`product-${product.id}`}
        data-product-id={product.id}
        key={key}
        className="block"
      >
        <div
          className="relative max-w-full overflow-hidden pb-[133.33%]"
          role="article"
          aria-label={`Product: ${product.name}`}
        >
          <Image
            src={currentImage}
            alt={product.name}
            fill={true}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:..."
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute left-0 top-0 block h-full w-full object-cover object-center transition-opacity duration-300"
          />

          {userId && showDelete ? (
            <div
              className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center text-red-500 transition-all duration-300 hover:scale-110"
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
              className={`absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-secondary transition-all duration-300 hover:scale-110 hover:bg-secondary/10 ${isLoading ? "animate-pulse" : ""}`}
              onClick={handleFavoriteClick}
              aria-label={
                isFavorite ? "Remove from wishlist" : "Add to wishlist"
              }
            >
              {isFavorite ? <HeartFilled /> : <HeartOutlined />}
            </div>
          )}
        </div>

        <div
          className={`relative z-10 flex min-h-8 w-full flex-1 flex-col items-center bg-white pb-2 pt-1 text-[13px] transition-all duration-300 ${shouldShowVariantsOnHover ? "sm:group-hover:-translate-y-9" : ""}`}
        >
          {product.isDiscounted && (
            <div className="absolute -top-9 left-0 bg-red-500 px-3 py-0.5 text-[13px] text-white">
              -{product.discount}%
            </div>
          )}
          <p className="mb-1 w-full truncate overflow-ellipsis whitespace-nowrap text-nowrap text-sm capitalize">
            {product.name}
          </p>
          <div className="relative mb-1 grid w-full grid-cols-[1fr_auto] items-center gap-1.5 px-2">
            {product.isDiscounted ? (
              <div className="flex items-center justify-center gap-2 text-[15px] sm:ml-8">
                <p className="text-xs font-bold text-gray-500 line-through">
                  {formatToNaira(product.price)}
                </p>
                <p className="font-bold text-primary">
                  {formatToNaira(discountedPrice)}
                </p>
              </div>
            ) : (
              <p className="flex items-center justify-center text-[15px] font-bold sm:ml-8">
                {formatToNaira(product.price)}
              </p>
            )}
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-all duration-300 sm:ml-2 ${
                isAddingToCart ? "animate-pulse" : ""
              }`}
              aria-label="Add to cart"
            >
              <ShoppingOutlined className="text-[15px]" />
            </button>
          </div>
        </div>
      </Link>
      {product?.variant?.length > 0 && (
        <div
          className={`no-scrollbar flex items-center justify-center gap-2 overflow-x-auto bg-white pb-2 transition-all duration-300 ${shouldShowVariantsOnHover ? "bottom-0 left-1/2 sm:absolute sm:-translate-x-1/2" : ""}`}
        >
          {product?.variant?.slice(0, 5).map((variant, index) => (
            <div
              key={`${variant._id}-${index}`}
              className="h-6 w-6 flex-shrink-0 cursor-pointer hover:scale-110 md:h-7 md:w-7"
              onMouseEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImage(variantImages[index]);
              }}
            >
              <Image
                src={variantImages[index]}
                alt={`${product.name} variant ${index + 1}`}
                width={28}
                height={28}
                loading="lazy"
                className="h-full w-full rounded-full object-cover object-center"
              />
            </div>
          ))}
          {product?.variant?.length > 5 && (
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-600 md:h-7 md:w-7">
              +{product.variant.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
