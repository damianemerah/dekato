"use client";
import Image from "next/image";
import { ButtonPrimary } from "./button";
import { oswald } from "@/style/font";
import DeleteIcon from "@/public/assets/icons/delete.svg";
import { removeFromWishlist } from "@/app/action/userAction";
import { createCartItem } from "@/app/action/cartAction";
import { mutate } from "swr";
import { useUserStore, useCartStore } from "@/store/store";
import { message } from "antd";
import Link from "next/link";

export default function Wishlist({ product }) {
  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const setCart = useCartStore((state) => state.setCart);

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

      const cartItem = await createCartItem(userId, newItem);
      await mutate(`/api/user/${userId}`);
      await mutate(`/cart/${userId}`);
      setCart(cartItem.item);
      message.success("Item added to cart");
    } catch (error) {
      message.info(error.message, 4);
    }
  };
  const removeItem = async () => {
    try {
      await removeFromWishlist(user.id, product.id);
      await mutate(`/account/wishlist/${user.id}`);
      message.success("Product removed from wishlist");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-start gap-4 rounded-lg bg-white p-2 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="relative flex w-full max-w-[250px] flex-col space-y-4">
        <Link href={`/p/${product.name}-${product.id}`}>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md">
            <Image
              src={product.image[0]}
              alt={product.name}
              className="object-cover transition-transform duration-300 hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="space-y-2">
            <p
              className={`${oswald.className} line-clamp-2 text-lg font-semibold leading-5 text-gray-800`}
            >
              {product.name}
            </p>
            <p className="text-base font-medium text-indigo-600">
              {product.price} NGN
            </p>
          </div>
        </Link>

        <ButtonPrimary
          className="w-full py-2 font-oswald text-sm uppercase tracking-wider transition-colors duration-300 hover:bg-indigo-700"
          onClick={() => {
            addToCart(product.id);
          }}
        >
          Add to Cart
        </ButtonPrimary>
        <button
          className="absolute right-2 top-0 flex-shrink-0 rounded-full bg-gray-100 p-2 transition-colors duration-300 hover:bg-gray-200"
          onClick={removeItem}
        >
          <DeleteIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
