import useSWR from 'swr';
import { getCart } from '@/app/action/cartAction';
import { useCartStore } from '@/app/store/store';

const fetchCart = (userId) => getCart(userId);

export default function useCartData(userId, options = {}) {
  const { skipInitialFetch = false } = options;
  const { setCart, cart } = useCartStore();

  const { data, isLoading, isValidating, error } = useSWR(
    userId ? `/cart/${userId}` : null,
    () => (userId ? fetchCart(userId) : null),
    {
      onSuccess: setCart,
      fallbackData: cart,
      revalidateOnFocus: false,
      suspense: false,
      revalidateIfStale: !skipInitialFetch,
      revalidateOnMount: !skipInitialFetch,
    }
  );

  return { cartData: data, isLoading, isValidating, error };
}
