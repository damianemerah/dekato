'use client';

import { useState, useCallback, useTransition, useEffect } from 'react';
import { addToWishlist, removeFromWishlist } from '@/app/action/userAction';
import { createCartItem } from '@/app/action/cartAction';
import { toast } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import useWishlistData from '@/app/hooks/useWishlistData';

import ProductGallery from './product-gallery';
import ProductInfo from './product-info';
import ProductVariants from './product-variants';
import ProductActions from './product-actions';
import ProductDetailsSections from './product-details-sections';
import useCartData from '@/app/hooks/useCartData';

function ProductDetailsErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md border border-red-200 bg-red-50 p-6 text-center">
      <h3 className="text-lg font-medium text-red-800">Something went wrong</h3>
      <p className="text-sm text-red-600">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
      >
        Try again
      </button>
    </div>
  );
}

const ProductDetail = function ProductDetail({ product }) {
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
          // Optimistically update the wishlist data
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
          // Optimistically update the wishlist data
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
        // Revalidate on error to ensure correct state
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

        console.log(result, 'result');

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

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold text-gray-600">
        Product not found
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 lg:gap-16">
        <div className="col-span-full md:col-span-7">
          <ErrorBoundary FallbackComponent={ProductDetailsErrorFallback}>
            <Suspense
              fallback={
                <div className="h-[450px] w-full animate-pulse bg-gray-100" />
              }
            >
              <ProductGallery
                product={product}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
                resetActiveImage={resetActiveImage}
              />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="col-span-full md:col-span-5">
          <ErrorBoundary FallbackComponent={ProductDetailsErrorFallback}>
            <div className="space-y-6">
              <div className="px-0 sm:px-0">
                <ProductInfo
                  product={product}
                  selectedVariant={selectedVariant}
                  isInWishlist={isInWishlist}
                  onWishlistToggle={handleAddToWishlist}
                  isPending={isWishlistPending}
                />

                {product.variant && product.variant.length > 0 && (
                  <ProductVariants
                    product={product}
                    selectedVariantOption={selectedVariantOption}
                    handleVariantSelection={handleVariantSelection}
                    setSelectedVariant={setSelectedVariant}
                    setActiveImage={setActiveImage}
                    isAvailable={isProductAvailable}
                  />
                )}

                <ProductActions
                  product={product}
                  selectedVariant={selectedVariant}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  onAddToCart={handleAddToCart}
                  isInWishlist={isInWishlist}
                  onWishlistToggle={handleAddToWishlist}
                  isPending={isAddingToCart}
                  isWishlistPending={isWishlistPending}
                />
              </div>

              <ProductDetailsSections product={product} />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
