'use client';

import { useState, useCallback, useTransition } from 'react';
import { addToWishlist, removeFromWishlist } from '@/app/action/userAction';
import { toast } from 'sonner';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

import ProductGallery from './product-gallery';
import ProductInfo from './product-info';
import ProductVariants from './product-variants';
import ProductActions from './product-actions';
import ProductDetailsSections from './product-details-sections';

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

const ProductDetail = function ProductDetail({
  product,
  selectedVariantOption,
  setSelectedVariantOption,
  selectedVariant,
  setSelectedVariant,
  quantity,
  setQuantity,
  isAddingToCart,
  isWishlistPending,
  isInWishlist,
  handleVariantSelection,
  handleAddToWishlist,
  onAddToCart,
  activeImage,
  setActiveImage,
  resetActiveImage,
  isProductAvailable,
}) {
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
                  onAddToCart={onAddToCart}
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
