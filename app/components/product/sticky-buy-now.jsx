'use client';

import React from 'react';
import { Button } from '@/app/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCartItem } from '@/app/action/cartAction';

const StickyBuyNow = ({
  handleAddToCart: propHandleAddToCart,
  selectedVariant,
  quantity,
  product,
  userId,
  mutateCartData,
  startTransition,
  setOptimisticInCart,
  setIsAddingToCart,
}) => {
  const router = useRouter();

  const handleAddToCartClick = () => {
    propHandleAddToCart();
  };

  const handleBuyNow = () => {
    if (!userId) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    if (product.variant.length > 0 && !selectedVariant) {
      toast.error('You have to select a variant');
      return;
    }

    setIsAddingToCart(true);
    setOptimisticInCart(true);

    startTransition(async () => {
      try {
        const newItem = {
          product: product.id,
          quantity: quantity,
          variantId: selectedVariant?.id,
          option: selectedVariant?.options || null,
        };

        const result = await createCartItem(userId, newItem);

        if (result?.error) {
          setOptimisticInCart(false);
          toast.error(result.message || 'Failed to add item to cart');
          return;
        }

        mutateCartData(
          ['cart-data', userId],
          (current) => ({
            ...current,
            items: [...(current?.items || []), newItem],
            totalItems: (current?.totalItems || 0) + 1,
          }),
          { revalidate: true }
        );

        toast.success('Added to cart, redirecting to checkout...');
        router.push('/checkout');
      } catch (error) {
        setOptimisticInCart(false);
        console.error('Error adding to cart for buy now:', error);
        toast.error(error.message || 'Failed to add to cart');
      } finally {
        setIsAddingToCart(false);
      }
    });
  };

  return (
    <div className="font-o fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-10 bg-background p-4 shadow-lg">
      <Button
        onClick={handleAddToCartClick}
        variant="outline"
        className="rounded-full border-primary px-12 py-6 text-xl font-normal md:px-24"
      >
        Add to Cart
      </Button>
      <Button
        onClick={handleBuyNow}
        className="rounded-full px-12 py-6 text-xl font-bold md:px-24"
      >
        Buy Now
      </Button>
    </div>
  );
};

export default StickyBuyNow;
