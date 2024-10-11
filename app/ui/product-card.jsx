"use client";

import Image from "next/image";
import Link from "next/link";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/store";
import { addToWishlist, removeFromWishlist } from "@/app/action/userAction";
import { message } from "antd";
import { mutate } from "swr";

export default function ProductCard({ product }) {
  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const [isFavorite, setIsFavorite] = useState(
    user?.wishlist?.includes(product.id),
  );

  useEffect(() => {
    if (user?.wishlist.length < 0) return;
    setIsFavorite(user?.wishlist?.includes(product.id));
  }, [user?.wishlist, product.id]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
    }
  };

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
            placeholder="blur"
            blurDataURL="data:..."
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute left-0 top-0 h-full w-full object-cover object-center"
          />
          {product.discount > 0 && (
            <div className="absolute bottom-3 left-0 bg-green-500 px-2.5 py-1 text-[13px] text-white">
              -{product.discount}%
            </div>
          )}
          <div
            className="absolute right-2 top-2 cursor-pointer text-2xl text-primary transition-all duration-300 hover:scale-110"
            onClick={handleFavoriteClick}
          >
            {isFavorite ? <HeartFilled /> : <HeartOutlined />}
          </div>
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
