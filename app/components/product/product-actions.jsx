'use client';

import { memo, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { MinusCircle, PlusCircle, Heart } from 'lucide-react';
import WhatsappIcon from '@/public/assets/icons/whatsapp.svg';
import { SmallSpinner } from '@/app/components/spinner';
import HeartFilledIcon from '@/public/assets/icons/heart-filled.svg';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { cn } from '@/app/lib/utils';
import { ButtonPrimary } from '../button';

const ProductActions = memo(function ProductActions({
  product,
  selectedVariant,
  quantity,
  setQuantity,
  onAddToCart,
  isInWishlist,
  onWishlistToggle,
  isPending,
  isWishlistPending,
}) {
  // Calculate max available quantity
  const maxQuantity = selectedVariant?.quantity || product.quantity || 0;
  const isOutOfStock = maxQuantity <= 0;

  // Handle quantity changes
  const decreaseQuantity = useCallback(() => {
    if (quantity > 1) setQuantity(quantity - 1);
  }, [quantity, setQuantity]);

  const increaseQuantity = useCallback(() => {
    if (quantity < maxQuantity) setQuantity(quantity + 1);
  }, [quantity, maxQuantity, setQuantity]);

  // Construct WhatsApp message
  const productName = product.name;
  const variantInfo = selectedVariant
    ? Object.entries(selectedVariant.options || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
    : '';

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in purchasing "${productName}" from Dekato Outfit. ${
      variantInfo ? `Variant: ${variantInfo}. ` : ''
    }Please provide more information.`
  );

  const whatsappLink = `https://wa.me/+2348012345678?text=${whatsappMessage}`;

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="space-y-4 p-0">
        {/* Quantity selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium uppercase text-gray-700">
            Quantity:
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1 || isOutOfStock}
              aria-label="Decrease quantity"
              className="h-8 w-8"
            >
              <MinusCircle className="h-5 w-5" />
            </Button>

            <span className="w-8 text-center font-semibold">{quantity}</span>

            <Button
              variant="ghost"
              size="icon"
              onClick={increaseQuantity}
              disabled={quantity >= maxQuantity || isOutOfStock}
              aria-label="Increase quantity"
              className="h-8 w-8"
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>

          {maxQuantity < 10 && maxQuantity > 0 && (
            <span className="text-xs text-amber-600">
              Only {maxQuantity} available
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 space-y-3">
          <div className="flex gap-3">
            <ButtonPrimary
              variant="default"
              className="flex h-12 w-full items-center justify-center text-base font-semibold uppercase transition-all duration-200 hover:brightness-95"
              onClick={onAddToCart}
              disabled={isPending || isOutOfStock}
            >
              {isPending ? (
                <SmallSpinner className="!text-white" />
              ) : (
                <>
                  <span>Add to Bag</span>
                </>
              )}
            </ButtonPrimary>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={
                      isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                    onClick={onWishlistToggle}
                    disabled={isWishlistPending}
                    className="h-12 w-12 border-background"
                  >
                    {isWishlistPending ? (
                      <SmallSpinner className="h-5 w-5 text-primary" />
                    ) : isInWishlist ? (
                      <HeartFilledIcon className="h-5 w-5 text-primary" />
                    ) : (
                      <Heart className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="text-left">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-green-600 underline hover:text-green-700"
            >
              <WhatsappIcon className="h-4 w-4" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default ProductActions;
