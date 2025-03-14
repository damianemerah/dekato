"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect, useTransition } from "react";
import { useUserStore, useRecommendMutateStore } from "@/app/store/store";
import { addToWishlist, removeFromWishlist } from "@/app/action/userAction";
import { createCartItem } from "@/app/action/cartAction";
import { toast } from "sonner";
import { formatToNaira } from "@/app/utils/getFunc";
import { trackClick } from "@/app/utils/tracking";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { mutate } from "swr";
import useCartData from "@/app/hooks/useCartData";

// Shadcn components
import { Card, CardContent, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

// Icons
import { Heart, X, Check, ShoppingBag } from "lucide-react";

const ProductCard = ({ product, showDelete = false }) => {
  const [currentImage, setCurrentImage] = useState(product?.image[0]);
  const [variantImages, setVariantImages] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [optimisticIsFavorite, setOptimisticIsFavorite] = useState(false);
  const [optimisticInCart, setOptimisticInCart] = useState(false);

  // Get user data from store
  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  // Use the cart data hook for better synchronization
  const { cartData, isLoading: cartLoading } = useCartData(userId);

  const setShouldMutate = useRecommendMutateStore(
    (state) => state.setShouldMutate
  );

  // Check if product is in wishlist or cart
  const isInWishlist = user?.wishlist?.includes(product.id);

  // Enhanced cart item check
  const isInCart = useCallback(() => {
    if (!cartData?.item || !Array.isArray(cartData.item)) return false;
    return cartData.item.some(
      (item) => item.product?.id === product.id || item.product === product.id
    );
  }, [cartData?.item, product.id]);

  // Set initial states based on user data
  useEffect(() => {
    setOptimisticIsFavorite(isInWishlist);
    setOptimisticInCart(isInCart());
  }, [isInWishlist, isInCart]);

  // Use custom hooks for responsive design
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const supportsHover = useMediaQuery("(hover: hover)");

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

  // Handle add to cart action with optimistic update
  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!userId) {
        toast.error("Please login to add to cart");
        return;
      }

      if (optimisticInCart) {
        toast.info("Item already in cart");
        return;
      }

      // Optimistic update
      setOptimisticInCart(true);

      const newItem = {
        product: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image[0],
        userId,
      };

      // Server action with transition
      startTransition(async () => {
        try {
          await createCartItem(userId, newItem);
          // Add proper revalidation to ensure UI updates
          await mutate(`/api/user/${userId}`);
          await mutate(`/cart/${userId}`);
          toast.success("Item added to cart");
        } catch (error) {
          setOptimisticInCart(false);
          toast.error(error.message || "Failed to add item to cart");
        }
      });
    },
    [userId, product, optimisticInCart]
  );

  // Handle wishlist toggling with optimistic update
  const handleFavoriteClick = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!userId) {
        toast.error("Please login to add to wishlist");
        return;
      }

      // Optimistic update
      setOptimisticIsFavorite(!optimisticIsFavorite);

      // Server action with transition
      startTransition(async () => {
        try {
          if (optimisticIsFavorite) {
            await removeFromWishlist(userId, product.id);
            // Add revalidation for consistency
            await mutate(`/api/user/${userId}`);
            toast.success("Removed from wishlist");
          } else {
            await addToWishlist(userId, product.id);
            // Add revalidation for consistency
            await mutate(`/api/user/${userId}`);
            toast.success("Added to wishlist");
          }
        } catch (error) {
          // Revert optimistic update on error
          setOptimisticIsFavorite(!optimisticIsFavorite);
          toast.error(error.message || "Failed to update wishlist");
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
          const response = await fetch("/api/recommendations", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: product.id }),
          });

          if (response.ok) {
            setShouldMutate(true);
            toast.success("Product removed from recommendations");
          }
        } catch (error) {
          toast.error("Failed to remove product");
          console.error(error);
        }
      });
    },
    [product.id, setShouldMutate]
  );

  // Control whether to show variants on hover
  const shouldShowVariantsOnHover = supportsHover && isDesktop;

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
                    variant={optimisticIsFavorite ? "default" : "ghost"}
                    size="icon"
                    className={`absolute right-2 top-2 h-7 w-7 ${
                      optimisticIsFavorite
                        ? "bg-red-500 p-1 text-white hover:bg-red-600"
                        : "bg-white/80 p-1 text-secondary hover:bg-white/90"
                    } ${isPending ? "animate-pulse" : ""}`}
                    onClick={handleFavoriteClick}
                    disabled={isPending}
                    aria-label={
                      optimisticIsFavorite
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        optimisticIsFavorite ? "fill-white stroke-white" : ""
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {optimisticIsFavorite
                      ? "Added to wishlist"
                      : "Add to wishlist"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <CardContent
          className={`relative z-10 flex min-h-[4rem] flex-col items-center bg-white p-3 text-sm transition-all duration-300 ${shouldShowVariantsOnHover ? "md:group-hover:-translate-y-9" : ""}`}
        >
          <h3 className="mb-1 w-full truncate text-center capitalize">
            {product.name}
          </h3>

          <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center">
            {/* Empty left column for balance */}
            <div className="col-start-1"></div>

            {/* Center column with price */}
            <div className="col-start-2 flex flex-col items-center justify-center text-center">
              {product.isDiscounted ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs text-muted-foreground line-through">
                    {formatToNaira(product.price)}
                  </span>
                  <span className="font-medium text-primary">
                    {formatToNaira(discountedPrice)}
                  </span>
                </div>
              ) : (
                <span className="font-medium text-primary">
                  {formatToNaira(product.price)}
                </span>
              )}
            </div>

            {/* Right column with cart button */}
            <div className="col-start-3 flex justify-end">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={optimisticInCart ? "default" : "ghost"}
                      size="icon"
                      className={`h-8 w-8 rounded-full ${
                        optimisticInCart
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-muted text-muted-foreground hover:bg-muted/30"
                      } p-0 ${isPending ? "animate-pulse" : ""}`}
                      onClick={handleAddToCart}
                      disabled={isPending}
                      aria-label={
                        optimisticInCart ? "Item in cart" : "Add to cart"
                      }
                    >
                      <ShoppingBag
                        className={`h-4 w-4 ${
                          optimisticInCart ? "stroke-white" : ""
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{optimisticInCart ? "Added to cart" : "Add to cart"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Variant selector */}
      {product?.variant?.length > 0 && (
        <CardFooter
          className={`no-scrollbar flex items-center justify-center gap-2 overflow-x-auto bg-white p-2 transition-all duration-300 ${shouldShowVariantsOnHover ? "absolute bottom-0 left-1/2 -translate-x-1/2" : ""}`}
        >
          {product?.variant?.slice(0, 5).map((variant, index) => (
            <Button
              key={`${variant._id}-${index}`}
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full p-0 md:h-7 md:w-7"
              onMouseEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentImage(variantImages[index]);
              }}
            >
              <Image
                src={variantImages[index]}
                alt={`${product.name} variant ${index + 1}`}
                width={28}
                height={28}
                className="h-full w-full rounded-full object-cover object-center"
              />
            </Button>
          ))}

          {product?.variant?.length > 5 && (
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground md:h-7 md:w-7">
              +{product.variant.length - 5}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ProductCard;
