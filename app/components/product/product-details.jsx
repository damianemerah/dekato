'use client';

import { useState, useCallback, useTransition, useEffect } from 'react';
import { useUserStore } from '@/app/store/store';
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
import { useCart } from '@/app/hooks/use-cart';

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

  const [selectedVariantOption, setSelectedVariantOption] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [optimisticInCart, setOptimisticInCart] = useState(false);

  const isInWishlist = wishlistData?.items?.includes(product.id);

  const handleVariantSelection = useCallback((name, value) => {
    setSelectedVariantOption((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

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
          await addToWishlist(userId, product.id);
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

    setIsAddingToCart(true);
    setOptimisticInCart(true);

    startTransition(async () => {
      try {
        const newItem = {
          product: product.id,
          quantity: quantity,
          variantId: selectedVariant?._id,
          option: selectedVariantOption,
        };

        const result = await createCartItem(userId, newItem);

        if (!result) {
          throw new Error('Failed to add item to cart');
        }

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
    selectedVariantOption,
    startTransition,
  ]);

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold text-gray-600">
        Product not found
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 lg:gap-16">
        <div className="md:col-span-7">
          <ErrorBoundary FallbackComponent={ProductDetailsErrorFallback}>
            <Suspense
              fallback={
                <div className="h-[450px] w-full animate-pulse bg-gray-100" />
              }
            >
              <ProductGallery product={product} />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="md:col-span-5">
          <ErrorBoundary FallbackComponent={ProductDetailsErrorFallback}>
            <div className="max-w-md space-y-6">
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
