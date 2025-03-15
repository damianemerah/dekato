"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect, useTransition } from "react";
import { useUserStore, useRecommendMutateStore } from "@/app/store/store";
import { addToWishlist, removeFromWishlist } from "@/app/action/userAction";
import { toast } from "sonner";
import { formatToNaira } from "@/app/utils/getFunc";
import { trackClick } from "@/app/utils/tracking";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { useCart } from "@/app/hooks/use-cart";
import { mutate } from "swr";

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

  // Get user data from store
  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  // Use the cart hook
  const { toggleCartItem, isInCart, isCartLoading } = useCart();

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

  // Handle add to cart action using the cart hook
  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!userId) {
        toast.error("Please login to add to cart");
        return;
      }

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
        console.error("Cart operation failed:", error);
      }
    },
    [userId, product, toggleCartItem]
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

      // Toggle wishlist state
      const newWishlistState = !optimisticIsFavorite;

      // Optimistic update for immediate UI feedback
      setOptimisticIsFavorite(newWishlistState);

      // Server action with transition
      startTransition(async () => {
        try {
          if (newWishlistState) {
            await addToWishlist(userId, product.id);
            toast.success("Added to wishlist");
          } else {
            await removeFromWishlist(userId, product.id);
            toast.success("Removed from wishlist");
          }

          // Revalidate user data to update UI throughout the app
          await mutate(`/api/user/${userId}`);
        } catch (error) {
          // Revert optimistic update on error
          setOptimisticIsFavorite(!newWishlistState);
          toast.error(
            error.message ||
              `Failed to ${newWishlistState ? "add to" : "remove from"} wishlist`
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
                    variant={optimisticIsFavorite ? "default" : "ghost"}
                    size="icon"
                    className={`absolute right-2 top-2 h-7 w-7 ${
                      optimisticIsFavorite
                        ? "bg-red-500 p-1 text-white hover:bg-red-600"
                        : "bg-muted text-muted-foreground/60 hover:bg-muted/30"
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
                      ? "Remove from wishlist"
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
                      variant={productInCart ? "default" : "ghost"}
                      size="icon"
                      className={`h-8 w-8 rounded-full ${
                        productInCart
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-muted text-muted-foreground/60 hover:bg-muted/30"
                      } p-0 ${isCartLoading ? "animate-pulse" : ""}`}
                      onClick={handleAddToCart}
                      disabled={isCartLoading}
                      aria-label={
                        productInCart ? "Remove from cart" : "Add to cart"
                      }
                    >
                      <ShoppingBag
                        className={`h-4 w-4 ${
                          productInCart ? "stroke-white" : ""
                        }`}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{productInCart ? "Remove from cart" : "Add to cart"}</p>
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
