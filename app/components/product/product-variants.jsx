'use client';

import { memo, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Undo2 } from 'lucide-react';
import { generateVariantOptions } from '@/app/utils/getFunc';
import Image from 'next/image';
import { Check } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { cn } from '@/app/lib/utils';

const ProductVariants = memo(function ProductVariants({
  product,
  selectedVariantOption,
  handleVariantSelection,
  setSelectedVariant,
  setActiveImage,
  isAvailable,
}) {
  const [variantOptions, setVariantOptions] = useState([]);
  const [validVariants, setValidVariants] = useState(new Map());

  useEffect(() => {
    if (product?.variant && product.variant.length > 0) {
      const options = generateVariantOptions(product.variant);
      const sortedOptions = [
        ...options.filter((option) => option.name.toLowerCase() === 'color'),
        ...options.filter((option) => option.name.toLowerCase() !== 'color'),
      ];
      setVariantOptions(sortedOptions);

      const newValidVariants = new Map();

      sortedOptions.forEach((option) => {
        const optionName = option.name;

        option.values.forEach((optionValue) => {
          const key = `${optionName}:${optionValue}`;
          newValidVariants.set(key, new Map());

          const matchingVariants = product.variant.filter(
            (variant) => variant.options[optionName] === optionValue
          );

          sortedOptions.forEach((otherOption) => {
            const otherName = otherOption.name;
            if (otherName !== optionName) {
              const validValues = new Set(
                matchingVariants.map((variant) => variant.options[otherName])
              );
              newValidVariants.get(key).set(otherName, Array.from(validValues));
            }
          });
        });
      });

      setValidVariants(newValidVariants);
    }
  }, [product?.variant]);

  // Update selected variant when options change
  useEffect(() => {
    if (
      product?.variant &&
      product.variant.length > 0 &&
      Object.keys(selectedVariantOption).length > 0
    ) {
      // Find all variants that match the selected options
      const matchingVariants = product.variant.filter((variant) => {
        return Object.entries(selectedVariantOption).every(
          ([key, value]) => variant.options[key] === value
        );
      });

      setSelectedVariant(matchingVariants.length ? matchingVariants[0] : null);
    } else {
      setSelectedVariant(null);
    }
  }, [product?.variant, selectedVariantOption, setSelectedVariant]);

  const getValidValuesForOption = useCallback(
    (optionName, value) => {
      const otherSelections = Object.entries(selectedVariantOption).filter(
        ([name]) => name !== optionName
      );

      if (otherSelections.length === 0) {
        return true;
      }

      for (const [selectedName, selectedValue] of otherSelections) {
        const key = `${selectedName}:${selectedValue}`;
        const validValues = validVariants.get(key)?.get(optionName);

        if (validValues && !validValues.includes(value)) {
          return false;
        }
      }

      return true;
    },
    [selectedVariantOption, validVariants]
  );

  const handleResetSelections = useCallback(() => {
    Object.keys(selectedVariantOption).forEach((option) => {
      handleVariantSelection(option, null);
    });
  }, [selectedVariantOption, handleVariantSelection]);

  if (!variantOptions.length) return null;

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="space-y-3 p-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium uppercase text-primary">Options</p>
          {Object.keys(selectedVariantOption).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={handleResetSelections}
            >
              <Undo2 className="mr-1 h-3.5 w-3.5" />
              <span className="text-xs">Reset</span>
            </Button>
          )}
        </div>
        {variantOptions.map((option) => {
          const optionValues = option.values;

          return (
            <div key={option.id} className="mb-3">
              <p className="mb-2 text-sm font-medium text-gray-700">
                <span className="uppercase">{option.name}</span>:{' '}
                <span className="font-semibold uppercase">
                  {selectedVariantOption[option.name] || 'Select'}
                </span>
              </p>

              <div className="flex flex-wrap gap-2">
                {optionValues.map((value, index) => {
                  const isValid = getValidValuesForOption(option.name, value);
                  const isSelected =
                    selectedVariantOption[option.name] === value;

                  if (option.name.toLowerCase() === 'color') {
                    // Find the specific variant with this color for the image
                    const variantWithThisColor = product.variant.find(
                      (v) => v.options.color === value
                    );
                    const imageUrl = variantWithThisColor?.image || '';

                    return (
                      <TooltipProvider key={value}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={cn(
                                'relative overflow-hidden transition-all duration-200',
                                isSelected
                                  ? 'ring-2 ring-primary ring-offset-1'
                                  : 'border border-gray-300',
                                !isValid &&
                                  !isSelected &&
                                  'opacity-40 hover:opacity-60'
                              )}
                              onClick={() => {
                                handleVariantSelection(
                                  option.name,
                                  isSelected ? null : value
                                );
                                if (setActiveImage) {
                                  if (isSelected) {
                                    setActiveImage(null);
                                  } else {
                                    setActiveImage(imageUrl);
                                  }
                                }
                              }}
                              disabled={!isAvailable}
                              aria-label={`Select color: ${value}`}
                            >
                              <div className="relative h-14 w-10 overflow-hidden">
                                <Image
                                  src={imageUrl}
                                  alt={`${value} color`}
                                  fill
                                  sizes="56px"
                                  className="object-cover"
                                />
                              </div>
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize">{value}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  } else {
                    // Other options (size, etc.)
                    return (
                      <button
                        key={`${option.name}-${value}`}
                        disabled={!isAvailable}
                        className={cn(
                          'relative h-9 min-w-[2.5rem] border px-3 text-sm uppercase transition-all duration-200',
                          isSelected
                            ? 'border-primary bg-primary/5 font-semibold text-primary'
                            : 'border-gray-300 text-gray-700',
                          !isValid &&
                            !isSelected &&
                            'opacity-40 hover:opacity-60'
                        )}
                        onClick={() =>
                          handleVariantSelection(
                            option.name,
                            isSelected ? null : value
                          )
                        }
                        title={value}
                        aria-label={`Select ${option.name}: ${value}`}
                      >
                        {value}
                      </button>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
});

export default ProductVariants;
