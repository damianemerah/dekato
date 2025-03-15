"use client";

import { useState, useCallback, useEffect } from "react";
import { createCartItem, removeFromCart } from "@/app/action/cartAction";
import { useUserStore } from "@/app/store/store";
import { mutate } from "swr";
import { toast } from "sonner";
import useCartData from "@/app/hooks/useCartData";

export function useCart() {
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [optimisticCartItems, setOptimisticCartItems] = useState(new Map());
  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  // Use the cart data hook for real-time cart status
  const { cartData } = useCartData(userId);

  // Reset optimistic state when cart data changes
  useEffect(() => {
    if (cartData?.item) {
      // Build a map of product IDs to cart status
      const newOptimisticItems = new Map();
      cartData.item.forEach((item) => {
        const productId = item.product?.id || item.product;
        if (productId) {
          newOptimisticItems.set(productId, {
            inCart: true,
            cartItemId: item.id,
          });
        }
      });

      // Only update if necessary to avoid loops
      if (newOptimisticItems.size !== optimisticCartItems.size) {
        setOptimisticCartItems(newOptimisticItems);
      }
    }
  }, [cartData]);

  // Check if an item is in the cart
  const isInCart = useCallback(
    (productId) => {
      return optimisticCartItems.has(productId);
    },
    [optimisticCartItems]
  );

  // Add item to cart
  const addToCart = useCallback(
    async (item) => {
      if (!userId) {
        toast.error("Please sign in to add items to your cart");
        throw new Error("You must be logged in to add items to your cart");
      }

      setIsCartLoading(true);

      // Optimistic update
      setOptimisticCartItems((prev) => {
        const newMap = new Map(prev);
        newMap.set(item.productId, { inCart: true, cartItemId: null });
        return newMap;
      });

      try {
        const newItem = {
          product: item.productId,
          quantity: item.quantity || 1,
          option: item.option,
          variantId: item.variantId || null,
        };

        const result = await createCartItem(userId, newItem);

        if (!result) {
          throw new Error("Failed to add item to cart");
        }

        await mutate(`/api/user/${userId}`);
        await mutate(`/cart/${userId}`);
        await mutate(`/checkout-data`);

        toast.success("Item added to cart");
        return result;
      } catch (error) {
        // Revert optimistic update
        setOptimisticCartItems((prev) => {
          const newMap = new Map(prev);
          newMap.delete(item.productId);
          return newMap;
        });

        toast.error(error.message || "Failed to add to cart");
        throw error;
      } finally {
        setIsCartLoading(false);
      }
    },
    [userId]
  );

  // Remove item from cart
  const removeFromCartById = useCallback(
    async (productId) => {
      if (!userId) {
        toast.error("Please sign in to remove items from your cart");
        throw new Error("You must be logged in to remove items from your cart");
      }

      setIsCartLoading(true);

      // Get cart item ID if available, or store current state for rollback
      const currentCartState = optimisticCartItems.get(productId);
      let cartItemId = currentCartState?.cartItemId;

      // If we don't have the cart item ID stored in our optimistic state
      if (!cartItemId && cartData?.item) {
        // Find it in the cart data
        const cartItem = cartData.item.find(
          (item) => item.product?.id === productId || item.product === productId
        );
        cartItemId = cartItem?.id;
      }

      if (!cartItemId) {
        toast.error("Item not found in cart");
        setIsCartLoading(false);
        return;
      }

      // Optimistic update
      setOptimisticCartItems((prev) => {
        const newMap = new Map(prev);
        newMap.delete(productId);
        return newMap;
      });

      try {
        await removeFromCart(userId, cartItemId);

        await mutate(`/api/user/${userId}`);
        await mutate(`/cart/${userId}`);
        await mutate(`/checkout-data`);

        toast.success("Item removed from cart");
      } catch (error) {
        // Revert optimistic update
        if (currentCartState) {
          setOptimisticCartItems((prev) => {
            const newMap = new Map(prev);
            newMap.set(productId, currentCartState);
            return newMap;
          });
        }

        toast.error(error.message || "Failed to remove from cart");
        throw error;
      } finally {
        setIsCartLoading(false);
      }
    },
    [userId, cartData, optimisticCartItems]
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
    isCartLoading,
    cartItems: optimisticCartItems,
  };
}
