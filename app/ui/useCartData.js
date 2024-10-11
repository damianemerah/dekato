import useSWR from "swr";
import { getCart } from "@/app/action/cartAction";
import { useCartStore } from "@/store/store";

const fetchCart = (userId) => getCart(userId);

export default function useCartData(userId) {
  const { setCart, cart } = useCartStore();
  const { data, isLoading, isValidating, error } = useSWR(
    userId ? `/cart/${userId}` : null,
    () => fetchCart(userId),
    {
      onSuccess: setCart,
      fallbackData: cart,
      revalidateOnFocus: false,
    },
  );

  return { cartData: data, isLoading, isValidating, error };
}
