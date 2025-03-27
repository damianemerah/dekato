import { auth } from "@/app/lib/auth";
import { getWishlist } from "@/app/action/userAction";
import WishlistPageClient from "@/app/components/account/wishlist/wishlists";

export default async function WishlistPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Authentication Required.</div>;
  }

  const wishlistProducts = await getWishlist(userId);

  return <WishlistPageClient initialWishlistProducts={wishlistProducts} />;
}
