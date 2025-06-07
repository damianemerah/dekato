'use client';

import { useState, useCallback, useTransition } from 'react';
import { addToWishlist, removeFromWishlist } from '@/app/action/userAction';
import { createCartItem } from '@/app/action/cartAction';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import useWishlistData from '@/app/hooks/useWishlistData';
import useCartData from '@/app/hooks/useCartData';
import { useRouter } from 'next/navigation';

import ProductDetail from './product-details';
import StickyBuyNow from './sticky-buy-now';

const ProductInteractionWrapper = ({ product }) => {
  const [isPending, startTransition] = useTransition();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlistPending, setIsWishlistPending] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { wishlistData, mutate: mutateWishlist } = useWishlistData(userId);
  const { mutate: mutateCartData } = useCartData(userId);

  const [selectedVariantOption, setSelectedVariantOption] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [optimisticInCart, setOptimisticInCart] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const resetActiveImage = useCallback(() => setActiveImage(null), []);
  const [isProductAvailable, setIsProductAvailable] = useState(true);

  const isInWishlist = wishlistData?.items?.includes(product.id);

  const handleVariantSelection = useCallback(
    (optionName, value) => {
      setSelectedVariantOption((prev) => {
        const updated = { ...prev, [optionName]: value };

        Object.keys(updated).forEach((otherKey) => {
          if (otherKey === optionName) return;

          const stillValid = product.variant.some(
            (variant) =>
              variant.options[optionName] === value &&
              variant.options[otherKey] === updated[otherKey]
          );

          if (!stillValid) {
            updated[otherKey] = null;
          }
        });

        const matched = product.variant.find((variant) =>
          Object.entries(updated).every(
            ([k, v]) => v === null || variant.options[k] === v
          )
        );

        if (matched) {
          setSelectedVariant(matched);
          setIsProductAvailable(true);
          if (matched.image) {
            setActiveImage(matched.image);
          }
          console.log(matched.options, 11111);
          setSelectedVariantOption(matched.options);
        } else {
          setSelectedVariant(null);
          setIsProductAvailable(false);
          setSelectedVariantOption({});
        }

        console.log(matched);

        if (matched.image) {
          setActiveImage(matched.image);
        }

        return updated;
      });
    },
    [product.variant, setActiveImage]
  );

  const handleAddToWishlist = useCallback(() => {
    if (!userId) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }

    setIsWishlistPending(true);
    startTransition(async () => {
      try {
        if (isInWishlist) {
          await removeFromWishlist(userId, product.id);
          mutateWishlist(
            (current) => ({
              count: (current?.count || 0) - 1,
              items: current?.items?.filter((id) => id !== product.id) || [],
            }),
            { revalidate: true }
          );
          toast.success('Removed from wishlist');
        } else {
          const result = await addToWishlist(userId, product.id);

          if (result?.error) {
            setIsWishlistPending(false);
            toast.error(result.message || 'Failed to add to wishlist');
            return;
          }
          mutateWishlist(
            (current) => ({
              count: (current?.count || 0) + 1,
              items: [...(current?.items || []), product.id],
            }),
            { revalidate: true }
          );
          toast.success('Added to wishlist');
        }
      } catch (error) {
        mutateWishlist();
        toast.error('Failed to update wishlist');
      } finally {
        setIsWishlistPending(false);
      }
    });
  }, [userId, product.id, isInWishlist, mutateWishlist, startTransition]);

  const handleAddToCart = useCallback(async () => {
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

        toast.success('Added to cart');
      } catch (error) {
        setOptimisticInCart(false);
        console.error('Error adding to cart:', error);
        toast.error(error.message || 'Failed to add to cart');
      } finally {
        setIsAddingToCart(false);
      }
    });
  }, [
    userId,
    product.id,
    quantity,
    selectedVariant,
    startTransition,
    mutateCartData,
    product?.variant?.length,
  ]);

  const router = useRouter();

  const handleBuyNow = useCallback(async () => {
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
  }, [
    userId,
    product.id,
    quantity,
    selectedVariant,
    startTransition,
    mutateCartData,
    product?.variant?.length,
    router,
  ]);

  return (
    <>
      <ProductDetail
        product={product}
        selectedVariantOption={selectedVariantOption}
        selectedVariant={selectedVariant}
        quantity={quantity}
        setQuantity={setQuantity}
        isAddingToCart={isAddingToCart}
        isWishlistPending={isWishlistPending}
        isInWishlist={isInWishlist}
        handleVariantSelection={handleVariantSelection}
        handleAddToWishlist={handleAddToWishlist}
        onAddToCart={handleAddToCart}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        resetActiveImage={resetActiveImage}
        isProductAvailable={isProductAvailable}
      />
      <StickyBuyNow
        handleAddToCart={handleAddToCart}
        selectedVariant={selectedVariant}
        quantity={quantity}
        product={product}
        userId={userId}
        mutateCartData={mutateCartData}
        startTransition={startTransition}
        setOptimisticInCart={setOptimisticInCart}
        setIsAddingToCart={setIsAddingToCart}
      />
    </>
  );
};

export default ProductInteractionWrapper;
