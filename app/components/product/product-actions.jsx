"use client";

import { memo, useCallback } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { MinusCircle, PlusCircle, ShoppingBag } from "lucide-react";
import WhatsappIcon from "@/public/assets/icons/whatsapp.svg";
import { SmallSpinner } from "@/app/components/spinner";
import { cn } from "@/app/lib/utils";
import { ButtonPrimary } from "../button";

const ProductActions = memo(function ProductActions({
  product,
  selectedVariant,
  quantity,
  setQuantity,
  onAddToCart,
  isPending,
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
        .join(", ")
    : "";

  const whatsappMessage = encodeURIComponent(
    `Hi, I'm interested in purchasing "${productName}" from Dekato Outfit. ${
      variantInfo ? `Variant: ${variantInfo}. ` : ""
    }Please provide more information.`
  );

  const whatsappLink = `https://wa.me/+2348012345678?text=${whatsappMessage}`;

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="space-y-4 p-0">
        {/* Quantity selector */}
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
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

        {/* Stock status */}
        <p
          className={cn(
            "text-sm",
            isOutOfStock ? "text-red-600" : "text-green-600"
          )}
        >
          {isOutOfStock ? "Out of stock" : "Product is available"}
        </p>

        {/* Action buttons */}
        <div className="mt-4 space-y-3">
          <Button
            variant="outline"
            className="group flex h-12 w-full items-center justify-center border-2 border-green-500 px-6 text-green-500 transition-colors duration-200 hover:bg-green-500 hover:text-white"
            asChild
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <WhatsappIcon className="mr-2 h-5 w-5 group-hover:text-white" />
              <span className="text-lg group-hover:text-white sm:text-base md:text-lg">
                Order on WhatsApp
              </span>
            </a>
          </Button>

          <ButtonPrimary
            variant="default"
            className="flex w-full items-center justify-center text-sm font-bold normal-case tracking-wide transition-all duration-200 hover:bg-opacity-90"
            onClick={onAddToCart}
            disabled={isPending || isOutOfStock}
          >
            {isPending ? (
              <SmallSpinner className="!text-white" />
            ) : (
              <>
                <ShoppingBag className="mr-2.5 h-5 w-5 sm:h-6 sm:w-6" />
                <span>Add to Bag</span>
              </>
            )}
          </ButtonPrimary>
        </div>
      </CardContent>
    </Card>
  );
});

export default ProductActions;
