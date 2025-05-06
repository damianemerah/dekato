'use client';

import { useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import useCartData from '@/app/hooks/useCartData';

/**
 * A simplified hook for checking cart state.
 * Cart mutations are now handled directly via server actions in the components.
 */
export function useCart() {
  // Get user ID from session
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Use the cart data hook for real-time cart status
  const { cartData, isLoading, isValidating, error, mutate } =
    useCartData(userId);

  // Check if an item is in the cart
  const isInCart = useCallback(
    (productId) => {
      if (!cartData?.item) return false;

      return cartData.item.some(
        (item) => (item.product?.id || item.product) === productId
      );
    },
    [cartData]
  );

  // Check if the cart is empty
  const isCartEmpty = useCallback(() => {
    return !cartData?.item || cartData.item.length === 0;
  }, [cartData]);

  // Get cart count
  const getCartCount = useCallback(() => {
    return cartData?.totalItems || 0;
  }, [cartData]);

  // Manually trigger a cart data refresh if needed
  const refreshCart = useCallback(() => {
    if (userId) {
      mutate();
    }
  }, [userId, mutate]);

  return {
    // Cart state getters
    isInCart,
    isCartEmpty,
    getCartCount,
    cartData,

    // Cart loading states
    isLoading,
    isValidating,
    error,

    // Manual refresh method
    refreshCart,
  };
}
