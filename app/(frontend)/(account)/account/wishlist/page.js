"use client";
import { ButtonSecondary } from "@/app/ui/button";
import Wishlist from "@/app/ui/Wishlist";
import AccountLayout from "@/app/(frontend)/(account)/account/AccountLayout";
import { oswald } from "@/style/font";
import useSWR from "swr";
import { getWishlist } from "@/app/action/userAction";
import { useUserStore } from "@/store/store";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const fetcher = async (id) => {
  const res = await getWishlist(id);
  return res;
};

export default function WishlistPage() {
  const user = useUserStore((state) => state.user);
  const wishlist = user?.wishlist || [];

  const { data: products, isLoading } = useSWR(
    wishlist?.length > 0 ? `/account/wishlist/${user.id}` : null,
    () => fetcher(user.id),
    {
      revalidateOnFocus: false,
    },
  );

  if (isLoading)
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    );

  if (products?.length === 0)
    return (
      <AccountLayout title="Wishlist" breadcrumbs={breadcrumbs}>
        <div>No products in wishlist</div>
      </AccountLayout>
    );

  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/account", label: "My Account" },
    { href: "/account/wishlist", label: "My WishList", active: true },
  ];

  return (
    <AccountLayout title="Wishlist" breadcrumbs={breadcrumbs}>
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
    </AccountLayout>
  );
}
