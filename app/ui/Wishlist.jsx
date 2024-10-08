"use client";
import Image from "next/image";
import { ButtonPrimary } from "./button";
import { oswald } from "@/style/font";
import DeleteIcon from "@/public/assets/icons/delete.svg";
import { removeFromWishlist } from "@/app/action/userAction";
import { createCartItem } from "@/app/action/cartAction";
import { mutate } from "swr";
import { message } from "antd";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { SmallSpinner } from "@/app/ui/spinner";

export default function Wishlist({ product }) {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;
  const [isLoading, setIsLoading] = useState(false);

  const discountedPrice =
    product.price - (product.price * product.discount) / 100;

  const addToCart = async () => {
    try {
      if (!userId) {
        message.error("Please login to add to cart");
        return;
      }
      const newItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image[0],
        userId,
      };

      await createCartItem(userId, newItem);
      setIsLoading(true);
      await removeFromWishlist(userId, product.id);
      await mutate(`/api/user/${userId}`);
      await mutate(`/cart/${userId}`);
      message.success("Item added to cart");
    } catch (error) {
      message.info(error.message, 4);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async () => {
    try {
      setIsLoading(true);
      await removeFromWishlist(user.id, product.id);
      await mutate(`/account/wishlist/${user.id}`);
      message.success("Product removed from wishlist");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-0.5 ml-2 w-[calc(50%-8px)] md:w-[calc(33.333%-8px)] md:min-w-56 lg:w-[calc(25%-8px)]">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <SmallSpinner className="!text-primary" />
        </div>
      )}
      <div className="relative flex h-full flex-col bg-white text-center transition-all duration-300 hover:shadow-md">
        <Link href={`/p/${product.slug}-${product.id}`}>
          <div className="relative w-full overflow-hidden pb-[133.33%]">
            <Image
              src={product.image[0] || "/placeholder-image.jpg"}
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
        </Link>
        <ButtonPrimary
          className="w-full bg-primary py-2 font-oswald text-sm uppercase tracking-wider transition-colors duration-300 hover:bg-opacity-70"
          onClick={addToCart}
        >
          Add to Cart
        </ButtonPrimary>
        <button
          className="absolute right-2 top-2 flex-shrink-0 rounded-full bg-gray-100 p-2 transition-colors duration-300 hover:bg-gray-200"
          onClick={removeItem}
        >
          <DeleteIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
