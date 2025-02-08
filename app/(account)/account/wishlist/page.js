import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const Wishlist = dynamic(() => import("@/app/ui/account/wishlist/wishlists"), {
  ssr: false,
  loading: () => <SmallSpinner className="!text-primary" />,
});

export default function WishlistPage() {
  return <Wishlist />;
}
