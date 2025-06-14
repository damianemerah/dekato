'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback, useEffect, useTransition, useRef } from 'react';
import { useUserStore, useRecommendMutateStore } from '@/app/store/store';
import { addToWishlist, removeFromWishlist } from '@/app/action/userAction';
import { toast } from 'sonner';
import { formatToNaira } from '@/app/utils/getFunc';
import { trackClick } from '@/app/utils/tracking';
import { useMediaQuery } from '@/app/hooks/use-media-query';
import { addToNaughtyListSA } from '@/app/action/recommendationAction';
import { useSession } from 'next-auth/react';
import { Edit } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';

// Shadcn components
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';

// Icons
import { Heart, X } from 'lucide-react';

const ProductCard = ({ product, showDelete = false }) => {
  const [currentImage, setCurrentImage] = useState(product?.image[0]);
  const [variantImages, setVariantImages] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [optimisticIsFavorite, setOptimisticIsFavorite] = useState(false);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(product.name);
  const [editQuantity, setEditQuantity] = useState(product.quantity);
  const [editPrice, setEditPrice] = useState(product.price);
  const [editLoading, setEditLoading] = useState(false);

  // Use a ref to track if we've performed a wishlist action
  const wishlistActionPerformedRef = useRef(false);

  // Get user data and setter from store for wishlist
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  // Get session data directly for authentication
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const setShouldMutate = useRecommendMutateStore(
    (state) => state.setShouldMutate
  );

  // Check if product is in wishlist
  const isInWishlist = user?.wishlist?.includes(product.id);

  // Set initial states based on user data, but only if we haven't performed a wishlist action
  useEffect(() => {
    if (!wishlistActionPerformedRef.current) {
      setOptimisticIsFavorite(isInWishlist);
    }
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

  // Handle wishlist toggling with optimistic update
  const handleFavoriteClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!userId) {
        toast.error('Please login to add to wishlist');
        return;
      }

      // Set flag to prevent external updates from overriding our state
      wishlistActionPerformedRef.current = true;

      // Toggle wishlist state
      const newWishlistState = !optimisticIsFavorite;

      // Optimistic update for immediate UI feedback
      setOptimisticIsFavorite(newWishlistState);

      // Trigger animation
      setIsHeartAnimating(true);
      setTimeout(() => setIsHeartAnimating(false), 500);

      // Server action with transition
      startTransition(async () => {
        try {
          if (newWishlistState) {
            const updatedUser = await addToWishlist(userId, product.id);
            if (updatedUser?.error) {
              toast.error(updatedUser.message || 'Failed to add to wishlist');
              return;
            }
            if (updatedUser) {
              setUser(updatedUser);
            }
            toast.success('Added to wishlist');
          } else {
            const result = await removeFromWishlist(userId, product.id);
            if (result?.error) {
              toast.error(result.message || 'Failed to remove from wishlist');
              return;
            }
            if (user && user.wishlist) {
              setUser({
                ...user,
                wishlist: user.wishlist.filter((id) => id !== product.id),
              });
            }
            toast.success('Removed from wishlist');
          }
          // Keep our optimistic state as is since the operation succeeded
        } catch (error) {
          // Revert optimistic update on error
          setOptimisticIsFavorite(!newWishlistState);
          wishlistActionPerformedRef.current = false; // Reset flag on error
          toast.error(
            error.message ||
              `Failed to ${newWishlistState ? 'add to' : 'remove from'} wishlist`
          );
        }
      });
    },
    [optimisticIsFavorite, userId, product.id, startTransition, user, setUser]
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
    [product.id, setShouldMutate, startTransition]
  );

  // Control whether to show variants on hover
  const shouldShowVariantsOnHover = supportsHover && isDesktop;

  // Check for admin
  const isAdmin = session?.user?.role === 'admin';

  // Handle quick admin update
  const handleQuickUpdate = async (e) => {
    e.preventDefault();
    // e.stopPropagation();
    setEditLoading(true);
    try {
      const res = await import('@/app/action/productAction').then((mod) =>
        mod.quickUpdateProductInfo({
          id: product.id,
          name: editName,
          quantity: Number(editQuantity),
          price: Number(editPrice),
        })
      );
      if (res && !res.error) {
        toast.success('Product updated');
        setEditOpen(false);
        // Optionally update UI optimistically
        setEditName(res.name);
        setEditQuantity(res.quantity);
        setEditPrice(res.price);
      } else {
        toast.error(res?.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Card className="group relative h-full overflow-hidden rounded-none border-none bg-transparent shadow-none transition-all duration-300 hover:border hover:shadow-sm">
      {/* Admin edit icon - absolutely positioned, NOT inside Link */}
      {isAdmin && (
        <div className="absolute right-2 top-12 z-20 flex flex-col items-center gap-2 shadow-sm">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <button
                className="h-8 w-8 rounded-full bg-white/50 p-1 text-primary hover:bg-primary/10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditOpen(true);
                }}
                aria-label="Edit product"
                type="button"
              >
                <Edit className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Edit Product Info</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleQuickUpdate(e);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium">Name</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    disabled={editLoading}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(e.target.value)}
                    disabled={editLoading}
                    min={0}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Price
                  </label>
                  <Input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    disabled={editLoading}
                    min={0}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={editLoading}>
                    {editLoading ? 'Saving...' : 'Save'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
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
            alt={`${product.name} - Dekato Outfit`}
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
          {userId && showDelete ? (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-secondary/20 p-1 text-primary shadow-sm hover:bg-white/90"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete(e);
              }}
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
                    variant="ghost"
                    size="icon"
                    className={`absolute right-2 top-2 z-20 h-8 w-8 rounded-full bg-white/50 shadow-sm transition-all duration-300 hover:bg-primary/10 ${isPending ? 'animate-pulse' : ''} ${
                      isHeartAnimating ? 'scale-125' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFavoriteClick(e);
                    }}
                    disabled={isPending}
                    aria-label={
                      optimisticIsFavorite
                        ? 'Remove from wishlist'
                        : 'Add to wishlist'
                    }
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors ${
                        optimisticIsFavorite
                          ? 'fill-primary stroke-primary'
                          : 'stroke-primary/70 hover:stroke-primary'
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
          {variantImages && variantImages.length > 0 && (
            <div
              className={`absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 ${shouldShowVariantsOnHover && 'opacity-0 transition-opacity duration-300 group-hover:opacity-100'}`}
            >
              {[product.image[0], ...variantImages].map(
                (image, index) =>
                  image && (
                    <button
                      key={index}
                      className={`h-7 w-7 rounded-full border md:h-8 md:w-8 ${
                        currentImage === image
                          ? 'border-primary'
                          : 'border-border'
                      } overflow-hidden`}
                      onMouseEnter={() => setCurrentImage(image)}
                      aria-label={`View ${product.name} variant ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Dekato Outfit variant ${index + 1}`}
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
              )}
            </div>
          )}
          {product?.variant?.length === 0 && product?.image.length > 1 && (
            <div
              className={`absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 ${shouldShowVariantsOnHover && 'opacity-0 transition-opacity duration-300 group-hover:opacity-100'}`}
            >
              {product.image.map(
                (image, index) =>
                  image && (
                    <button
                      key={index}
                      className={`h-7 w-7 rounded-full border md:h-8 md:w-8 ${
                        currentImage === image
                          ? 'border-primary'
                          : 'border-border'
                      } overflow-hidden`}
                      onMouseEnter={() => setCurrentImage(image)}
                      onClick={(e) => e.preventDefault()}
                      aria-label={`View ${product.name} variant ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} - Dekato Outfit variant ${index + 1}`}
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

      <CardContent className="space-y-2 px-0 py-4">
        <h3 className="line-clamp-2 font-light leading-tight">
          <Link
            href={`/product/${product.slug}-${product.id}`}
            onClick={handleProductClick}
            className="text-primary hover:text-primary/90"
          >
            {product.name}
          </Link>
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          <p className={`text-base font-semibold text-primary`}>
            {formatToNaira(discountedPrice)}
          </p>
          {product.isDiscounted && (
            <p className="text-sm text-muted-foreground line-through">
              {formatToNaira(product.price)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
