import { ButtonSecondary } from "@/components/Button";
import Wishlist from "@/components/Wishlist";

export default function WishlistPage() {
  return (
    <div className="bg-white pb-8 rounded-lg p-4 w-full">
      <h1 className="font-semibold text-2xl px-4 py-2 border-b border-b-gray-100 mb-1">
        WishList
      </h1>
      <div className="my-4 flex justify-end gap-2 items-center">
        <ButtonSecondary className="bg-slate-950 text-white">
          Add all to cart
        </ButtonSecondary>
        <ButtonSecondary>Clear wishlist</ButtonSecondary>
      </div>
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <Wishlist />
        <Wishlist />
        <Wishlist />
        <Wishlist />
      </div>
    </div>
  );
}
