'use client';

import { useCallback } from 'react';
import { createCartItem, removeFromCart } from '@/app/action/cartAction';
import { useUserStore } from '@/app/store/store';
import { toast } from 'sonner';
import useCartData from '@/app/hooks/useCartData';

export function useCart() {
  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  // Use the cart data hook for real-time cart status
  const { cartData } = useCartData(userId);

  // Check if an item is in the cart
  const isInCart = useCallback(
    (productId) => {
      return (
        cartData?.item?.some(
          (item) => (item.product?.id || item.product) === productId
        ) || false
      );
    },
    [cartData]
  );

  // Add item to cart
  const addToCart = useCallback(
    async (item) => {
      if (!userId) {
        toast.error('Please sign in to add items to your cart');
        throw new Error('You must be logged in to add items to your cart');
      }

      try {
        const newItem = {
          product: item.productId,
          quantity: item.quantity || 1,
          option: item.option,
          variantId: item.variantId || null,
        };

        const result = await createCartItem(userId, newItem);

        if (!result) {
          throw new Error('Failed to add item to cart');
        }

        toast.success('Item added to cart');
        return result;
      } catch (error) {
        toast.error(error.message || 'Failed to add to cart');
        throw error;
      }
    },
    [userId]
  );

  // Remove item from cart
  const removeFromCartById = useCallback(
    async (productId) => {
      if (!userId) {
        toast.error('Please sign in to remove items from your cart');
        throw new Error('You must be logged in to remove items from your cart');
      }

      const cartItemId = cartData?.item?.find(
        (item) => (item.product?.id || item.product) === productId
      )?.id;
      if (!cartItemId) {
        toast.error('Item not found in cart to remove.');
        return;
      }

      try {
        await removeFromCart(userId, cartItemId);
        toast.success('Item removed from cart');
      } catch (error) {
        toast.error(error.message || 'Failed to remove from cart');
        throw error;
      }
    },
    [userId, cartData]
  );

  // Toggle item in cart (add if not in cart, remove if in cart)
  const toggleCartItem = useCallback(
    async (item) => {
      const productId = item.productId;

      if (isInCart(productId)) {
        return removeFromCartById(productId);
      } else {
        return addToCart(item);
      }
    },
    [isInCart, removeFromCartById, addToCart]
  );

  return {
    addToCart,
    removeFromCart: removeFromCartById,
    toggleCartItem,
    isInCart,
  };
}
