'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useEffect, useTransition } from 'react';
import { useUserStore, useRecommendMutateStore } from '@/app/store/store';
import { addToWishlist, removeFromWishlist } from '@/app/action/userAction';
import { toast } from 'sonner';
import { formatToNaira } from '@/app/utils/getFunc';
import { trackClick } from '@/app/utils/tracking';
import { useMediaQuery } from '@/app/hooks/use-media-query';
import { useCart } from '@/app/hooks/use-cart';
import { addToNaughtyListSA } from '@/app/action/recommendationAction';

// Shadcn components
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';

// Icons
import { Heart, X, Check, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product, showDelete = false }) => {
  const [currentImage, setCurrentImage] = useState(product?.image[0]);
  const [variantImages, setVariantImages] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [isCartActionPending, startCartTransition] = useTransition();
  const [optimisticIsFavorite, setOptimisticIsFavorite] = useState(false);

  // Get user data from store
  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  // Use the cart hook
  const { toggleCartItem, isInCart } = useCart();

  const setShouldMutate = useRecommendMutateStore(
    (state) => state.setShouldMutate
  );

  // Check if product is in wishlist
  const isInWishlist = user?.wishlist?.includes(product.id);

  // Set initial states based on user data
  useEffect(() => {
    setOptimisticIsFavorite(isInWishlist);
  }, [isInWishlist]);

  // Use custom hooks for responsive design
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const supportsHover = useMediaQuery('(hover: hover)');

  // Set up product images and variants
  useEffect(() => {
    setCurrentImage(product?.image[0]);
    setVariantImages(product?.variant?.map((variant) => variant.image));
  }, [product]);

  // Calculate discounted price
  const discountedPrice = product.isDiscounted
    ? product.price - (product.price * product.discount) / 100
    : product.price;

  // Handle product click for analytics
  const handleProductClick = useCallback(async () => {
    if (!userId) return;
    await trackClick(userId, product.id);
  }, [userId, product.id]);

  // Handle add to cart action using the cart hook
  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!userId) {
        toast.error('Please login to add to cart');
        return;
      }

      startCartTransition(async () => {
        try {
          await toggleCartItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image[0],
            userId,
          });
        } catch (error) {
          // Error is handled in the hook
          console.error('Cart operation failed:', error);
        }
      });
    },
    [userId, product, toggleCartItem, startCartTransition]
  );

  // Handle wishlist toggling with optimistic update
  const handleFavoriteClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!userId) {
        toast.error('Please login to add to wishlist');
        return;
      }

      // Toggle wishlist state
      const newWishlistState = !optimisticIsFavorite;

      // Optimistic update for immediate UI feedback
      setOptimisticIsFavorite(newWishlistState);

      // Server action with transition
      startTransition(async () => {
        try {
          if (newWishlistState) {
            await addToWishlist(userId, product.id);
            toast.success('Added to wishlist');
          } else {
            await removeFromWishlist(userId, product.id);
            toast.success('Removed from wishlist');
          }

          // Removed SWR mutate call - server actions now handle revalidation
        } catch (error) {
          // Revert optimistic update on error
          setOptimisticIsFavorite(!newWishlistState);
          toast.error(
            error.message ||
              `Failed to ${newWishlistState ? 'add to' : 'remove from'} wishlist`
          );
        }
      });
    },
    [optimisticIsFavorite, userId, product.id]
  );

  // Handle removing from recommendations
  const handleDelete = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      startTransition(async () => {
        try {
          const result = await addToNaughtyListSA(product.id);
          if (result.success) {
            setShouldMutate(true);
            toast.success('Product removed from recommendations');
          } else {
            throw new Error(result.message || 'Failed to hide product');
          }
        } catch (error) {
          toast.error('Failed to remove product');
          console.error(error);
        }
      });
    },
    [product.id, setShouldMutate]
  );

  // Control whether to show variants on hover
  const shouldShowVariantsOnHover = supportsHover && isDesktop;

  // Check if the product is in the cart
  const productInCart = isInCart(product.id);

  return (
    <Card className="group relative h-full overflow-hidden rounded-none border-none transition-all duration-300 hover:border hover:shadow-sm">
      <Link
        href={`/product/${product.slug}-${product.id}`}
        onClick={handleProductClick}
        data-product-id={product.id}
        className="block"
      >
        <div
          className="relative overflow-hidden pb-[133.33%]"
          onMouseLeave={() => setCurrentImage(product?.image[0])}
        >
          <Image
            src={currentImage}
            alt={product.name}
            fill={true}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="absolute left-0 top-0 h-full w-full object-cover object-center transition-all duration-300"
          />

          {/* Discount badge */}
          {product.isDiscounted && (
            <div className="absolute left-0 top-0 bg-destructive px-3 py-1 text-xs text-white">
              -{product.discount}%
            </div>
          )}

          {/* Delete or Wishlist button */}
          {userId && showDelete ? (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7 bg-white/80 p-1 text-primary hover:bg-white/90"
              onClick={handleDelete}
              disabled={isPending}
              aria-label="Remove product"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={optimisticIsFavorite ? 'default' : 'ghost'}
                    size="icon"
                    className={`absolute right-2 top-2 h-7 w-7 ${
                      optimisticIsFavorite
                        ? 'bg-red-500 p-1 text-white hover:bg-red-600'
                        : 'bg-muted text-muted-foreground/60 hover:bg-muted/30'
                    } ${isPending ? 'animate-pulse' : ''}`}
                    onClick={handleFavoriteClick}
                    disabled={isPending}
                    aria-label={
                      optimisticIsFavorite
                        ? 'Remove from wishlist'
                        : 'Add to wishlist'
                    }
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        optimisticIsFavorite ? 'fill-white stroke-white' : ''
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {optimisticIsFavorite
                      ? 'Remove from wishlist'
                      : 'Add to wishlist'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Show variant images on hover (desktop only) */}
          {shouldShowVariantsOnHover &&
            variantImages &&
            variantImages.length > 0 && (
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {[product.image[0], ...variantImages].map(
                  (image, index) =>
                    image && (
                      <button
                        key={index}
                        className={`h-6 w-6 rounded-full border ${
                          currentImage === image
                            ? 'border-primary'
                            : 'border-border'
                        } overflow-hidden`}
                        onMouseEnter={() => setCurrentImage(image)}
                        aria-label={`View ${product.name} variant ${index + 1}`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} variant ${index + 1}`}
                          width={24}
                          height={24}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )
                )}
              </div>
            )}
        </div>
      </Link>

      <CardContent className="space-y-2 p-3">
        <h3 className="text-md line-clamp-2 font-medium leading-tight">
          <Link
            href={`/product/${product.slug}-${product.id}`}
            onClick={handleProductClick}
            className="text-primary hover:text-primary/90"
          >
            {product.name}
          </Link>
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`text-sm font-semibold ${
              product.isDiscounted ? 'text-destructive' : 'text-primary'
            }`}
          >
            {formatToNaira(discountedPrice)}
          </p>
          {product.isDiscounted && (
            <p className="text-xs text-muted-foreground line-through">
              {formatToNaira(product.price)}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t p-3">
        <div className="flex w-full justify-between gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleAddToCart}
                  size="sm"
                  variant={productInCart ? 'default' : 'outline'}
                  className={`flex-1 ${
                    productInCart ? 'bg-primary text-primary-foreground' : ''
                  }`}
                  disabled={isCartActionPending}
                  aria-label={
                    productInCart ? 'Remove from cart' : 'Add to cart'
                  }
                >
                  {isCartActionPending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : productInCart ? (
                    <>
                      <Check className="mr-1 h-4 w-4" /> In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="mr-1 h-4 w-4" /> Add to Cart
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{productInCart ? 'Remove from cart' : 'Add to cart'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
