"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { formatToNaira } from "@/app/utils/getFunc";
import { upperFirstLetter } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import HeartFilledIcon from "@/public/assets/icons/heart-filled.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { SmallSpinner } from "@/app/components/spinner";
import { memo, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const SocialSharePanel = dynamic(() => import("../social-panal"), {
  ssr: false,
});

const ProductInfo = memo(function ProductInfo({
  product,
  selectedVariant,
  isInWishlist,
  onWishlistToggle,
  isPending,
}) {
  // Calculate current price based on variant selection or base product
  const price = selectedVariant?.price || product.price;

  // Check if product has a discount
  const hasDiscount =
    product.isDiscounted ||
    (selectedVariant?.discountPrice &&
      selectedVariant.discountPrice < selectedVariant.price);

  // Calculate discounted price if applicable
  const discountedPrice =
    selectedVariant?.discountPrice ||
    (product.isDiscounted ? product.discountPrice : null);

  // Calculate discount percentage
  const discountPercentage = hasDiscount
    ? Math.round((1 - discountedPrice / price) * 100)
    : 0;

  // Create handler to initiate sharing
  const handleShare = useCallback(() => {
    // Try using Web Share API for native sharing if available
    if (navigator.share) {
      navigator
        .share({
          title: upperFirstLetter(product.name),
          text: product.description?.slice(0, 150) || "Check out this product",
          url: window.location.href,
        })
        .catch((error) => {
          // If native sharing fails or is cancelled, fallback to custom share panel
          const customEvent = new CustomEvent("toggleSharePanel", {
            detail: { position: { x: window.innerWidth - 150, y: 100 } },
          });
          window.dispatchEvent(customEvent);
        });
    } else {
      // For browsers without Web Share API, use custom share panel
      const customEvent = new CustomEvent("toggleSharePanel", {
        detail: { position: { x: window.innerWidth - 150, y: 100 } },
      });
      window.dispatchEvent(customEvent);
    }
  }, [product.name, product.description]);

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="space-y-4">
          {/* Title and sharing section */}
          <div className="flex items-start justify-between">
            <h1 className="font-oswald text-xl font-[900] uppercase text-gray-800 md:text-2xl">
              {upperFirstLetter(product.name)}
            </h1>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={
                        isInWishlist
                          ? "Remove from wishlist"
                          : "Add to wishlist"
                      }
                      onClick={onWishlistToggle}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <SmallSpinner className="h-5 w-5 text-primary" />
                      ) : isInWishlist ? (
                        <HeartFilledIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <Heart className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      aria-label="Share product"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share this product</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Social share panel is always rendered but hidden by default */}
          <SocialSharePanel />

          {/* Price section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <>
                  <span className="font-oswald text-xl font-medium text-green-600 md:text-2xl">
                    {formatToNaira(discountedPrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatToNaira(price)}
                  </span>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-green-50 text-green-700"
                  >
                    {discountPercentage}% OFF
                  </Badge>
                </>
              ) : (
                <span className="font-oswald text-xl font-medium md:text-2xl">
                  {formatToNaira(price)}
                </span>
              )}
            </div>

            {product.discountDuration && (
              <p className="text-sm text-red-500">
                Sale ends on{" "}
                {new Date(product.discountDuration).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Product brief description */}
          <div className="prose prose-sm max-w-none text-gray-600">
            <p>{product.description?.slice(0, 150)}...</p>
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
              {product.quantity > 0 ? "In Stock" : "Out of Stock"}
            </Badge>

            {product.quantity > 0 && product.quantity < 10 && (
              <span className="text-sm text-amber-600">
                Only {product.quantity} left!
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default ProductInfo;
