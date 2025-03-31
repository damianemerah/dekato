'use client';

import { useState, useCallback, useTransition, useEffect } from 'react';
import { useUserStore } from '@/app/store/store';
import { addToWishlist, removeFromWishlist } from '@/app/action/userAction';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

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
  const user = useUserStore((state) => state.user);
  const userId = user?.id;
  const { addToCart, isAddingToCart } = useCart();

  const [selectedVariantOption, setSelectedVariantOption] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Initialize isInWishlist based on user data
  useEffect(() => {
    if (user?.wishlist) {
      setIsInWishlist(user.wishlist.includes(product.id));
    }
  }, [user?.wishlist, product.id]);

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

    startTransition(async () => {
      try {
        if (isInWishlist) {
          await removeFromWishlist(userId, product.id);
          setIsInWishlist(false);
          toast.success('Removed from wishlist');
        } else {
          await addToWishlist(userId, product.id);
          setIsInWishlist(true);
          toast.success('Added to wishlist');
        }
      } catch (error) {
        toast.error('Failed to update wishlist');
      }
    });
  }, [userId, product.id, isInWishlist]);

  const handleAddToCart = useCallback(async () => {
    if (!userId) {
      toast.error('Please sign in to add items to your cart');
      return;
    }

    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        price: selectedVariant?.price || product.price,
        quantity,
        image: selectedVariant?.image || product.image[0],
        userId,
        option: selectedVariantOption,
        variantId: selectedVariant?._id,
      });
    } catch (error) {
      // Error is already handled in the useCart hook
      console.error('Error adding to cart:', error);
    }
  }, [
    userId,
    product,
    selectedVariant,
    quantity,
    selectedVariantOption,
    addToCart,
  ]);

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center text-lg font-semibold text-gray-600">
        Product not found
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <ErrorBoundary FallbackComponent={ProductDetailsErrorFallback}>
          <div className="lg:col-span-3">
            <Suspense
              fallback={
                <div className="h-[450px] w-full animate-pulse bg-gray-100" />
              }
            >
              <ProductGallery product={product} />
            </Suspense>
          </div>

          <div className="no-scrollbar lg:col-span-2 lg:max-h-screen lg:overflow-y-auto">
            <div className="px-2 sm:px-4 lg:p-5">
              <ProductInfo
                product={product}
                selectedVariant={selectedVariant}
                isInWishlist={isInWishlist}
                onWishlistToggle={handleAddToWishlist}
                isPending={isPending}
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
                isPending={isPending || isAddingToCart}
              />
            </div>

            <ProductDetailsSections product={product} />
          </div>
        </ErrorBoundary>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default ProductDetail;
