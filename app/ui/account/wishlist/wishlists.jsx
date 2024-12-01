"use client";
import { ButtonSecondary } from "@/app/ui/button";
import Wishlist from "@/app/ui/account/wishlist/wishlist";
import { oswald } from "@/style/font";
import useSWR from "swr";
import { getWishlist, removeFromWishlist } from "@/app/action/userAction";
import { SmallSpinner } from "@/app/ui/spinner";
import { useSession } from "next-auth/react";
import useUserData from "@/app/hooks/useUserData";
import Link from "next/link";
import { createCartItem } from "@/app/action/cartAction";
import { mutate } from "swr";
import { message } from "antd";
import { useState } from "react";

const fetcher = async (id) => {
  const res = await getWishlist(id);
  return res;
};

export default function WishlistPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { userData: user, isLoading: userIsLoading } = useUserData(userId);
  const wishlist = user?.wishlist || [];
  const [isAddingAll, setIsAddingAll] = useState(false);

  const {
    data: products,
    isLoading,
    mutate: mutateWishlist,
  } = useSWR(
    wishlist?.length > 0 ? `/account/wishlist/${user.id}` : null,
    () => fetcher(user.id),
    {
      revalidateOnFocus: false,
    },
  );

  const addAllToCart = async () => {
    if (!userId) {
      message.error("Please login to add to cart");
      return;
    }
    setIsAddingAll(true);
    try {
      for (const product of products) {
        const newItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image[0],
          userId,
        };
        await createCartItem(userId, newItem);
        await removeFromWishlist(userId, product.id);
      }
      await mutate(`/api/user/${userId}`);
      await mutate(`/cart/${userId}`);
      await mutateWishlist();
      message.success("All items added to cart");
    } catch (error) {
      message.error("Failed to add all items to cart");
    } finally {
      setIsAddingAll(false);
    }
  };

  if (isLoading || userIsLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );

  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center sm:p-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mb-4 h-12 w-12 text-gray-400 sm:h-16 sm:w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <h2
          className={`${oswald.className} mb-2 text-xl font-semibold sm:text-2xl`}
        >
          Your wishlist is empty
        </h2>
        <p className="mb-4 text-sm text-gray-600 sm:text-base">
          Start adding items to your wishlist to keep track of products you
          love!
        </p>
        <Link href="/">
          <ButtonSecondary
            className={`${oswald.className} border-2 border-primary bg-white px-4 py-2 text-xs uppercase text-primary transition-colors duration-300 hover:bg-primary hover:text-white sm:text-sm`}
          >
            Explore Products
          </ButtonSecondary>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1
        className={`${oswald.className} mb-6 text-2xl font-semibold sm:text-3xl`}
      >
        Your Wishlist
      </h1>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
        {products?.map((product) => (
          <Wishlist key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        <ButtonSecondary
          className={`${oswald.className} w-full border-2 border-grayOutline bg-grayBg px-4 py-2 text-xs uppercase text-grayText transition-colors duration-300 hover:bg-gray-200 sm:w-auto sm:text-sm`}
          onClick={addAllToCart}
          disabled={isAddingAll}
        >
          {isAddingAll ? (
            <SmallSpinner className="!text-grayText" />
          ) : (
            "Add all to cart"
          )}
        </ButtonSecondary>
        <ButtonSecondary
          className={`${oswald.className} w-full border-2 border-grayOutline bg-grayBg px-4 py-2 text-xs uppercase text-grayText transition-colors duration-300 hover:bg-gray-200 sm:w-auto sm:text-sm`}
        >
          Share Wishlist
        </ButtonSecondary>
      </div>
    </div>
  );
}
