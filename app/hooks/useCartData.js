import useSWR from 'swr';
import { getCart } from '@/app/action/cartAction';

const fetchCart = ([, userId]) => getCart(userId);

export default function useCartData(userId, options = {}) {
  const { skipInitialFetch = false } = options;

  const { data, isLoading, isValidating, error, mutate } = useSWR(
    userId ? ['cart-data', userId] : null,
    fetchCart,
    {
      revalidateOnFocus: false,
      suspense: false,
      revalidateIfStale: !skipInitialFetch,
      revalidateOnMount: !skipInitialFetch,
      dedupingInterval: 5000,
      errorRetryCount: 3,
    }
  );

  return { cartData: data, isLoading, isValidating, error, mutate };
}
