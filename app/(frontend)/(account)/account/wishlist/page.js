import { ButtonSecondary } from "@/app/ui/Button";
import Wishlist from "@/app/ui/Wishlist";
import AccountLayout from "../AccountLayout";
import { oswald } from "@/style/font";

export default function WishlistPage() {
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/account", label: "My Account" },
    { href: "/account/wishlist", label: "My WishList", active: true },
  ];

  return (
    <AccountLayout title="Wishlist" breadcrumbs={breadcrumbs}>
      <div className="grid grid-cols-3 gap-8">
        <Wishlist />
        <Wishlist />
        <Wishlist />
        <Wishlist />
      </div>
      <div className="my-4 mt-10 flex items-center gap-2">
        <ButtonSecondary
          className={`${oswald.className} bg-grayBg border-grayOutline text-grayText border-2 text-sm uppercase`}
        >
          Add all to cart
        </ButtonSecondary>
        <ButtonSecondary
          className={`${oswald.className} bg-grayBg border-grayOutline text-grayText border-2 text-sm uppercase`}
        >
          Share Wishlist
        </ButtonSecondary>
      </div>
    </AccountLayout>
  );
}
