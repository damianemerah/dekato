"use client";
import { ButtonSecondary } from "@/app/ui/button";
import Wishlist from "@/app/ui/Wishlist";
import { oswald } from "@/style/font";
import useSWR from "swr";
import { getWishlist } from "@/app/action/userAction";
import { SmallSpinner } from "@/app/ui/spinner";
import { useSession } from "next-auth/react";
import useUserData from "@/app/ui/useUserData";

const fetcher = async (id) => {
  const res = await getWishlist(id);
  return res;
};

export default function WishlistPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { userData: user, isLoading: userIsLoading } = useUserData(userId);
  const wishlist = user?.wishlist || [];

  const { data: products, isLoading } = useSWR(
    wishlist?.length > 0 ? `/account/wishlist/${user.id}` : null,
    () => fetcher(user.id),
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading || userIsLoading)
    return (
      <div className="flex items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );

  if (products?.length === 0) return <div>No products in wishlist</div>;

  return (
    <>
      <div className="grid grid-cols-3 gap-8">
        {products?.map((product) => (
          <Wishlist key={product.id} product={product} />
        ))}
      </div>
      <div className="my-4 mt-10 flex items-center gap-2">
        <ButtonSecondary
          className={`${oswald.className} border-2 border-grayOutline bg-grayBg text-sm uppercase text-grayText`}
        >
          Add all to cart
        </ButtonSecondary>
        <ButtonSecondary
          className={`${oswald.className} border-2 border-grayOutline bg-grayBg text-sm uppercase text-grayText`}
        >
          Share Wishlist
        </ButtonSecondary>
      </div>
    </>
  );
}
