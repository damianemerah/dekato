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
}) {
  const [variantOptions, setVariantOptions] = useState([]);
  const [validVariants, setValidVariants] = useState(new Map());

  // Generate variant options based on product variants
  useEffect(() => {
    if (product?.variant && product.variant.length > 0) {
      const options = generateVariantOptions(product.variant);
      // Sort variant options so color comes first
      const sortedOptions = [
        ...options.filter((option) => option.name.toLowerCase() === 'color'),
        ...options.filter((option) => option.name.toLowerCase() !== 'color'),
      ];
      setVariantOptions(sortedOptions);

      // Pre-compute available combinations for each option
      const newValidVariants = new Map();

      // For each option name (e.g., 'color', 'size')
      sortedOptions.forEach((option) => {
        const optionName = option.name;

        // For each value of this option (e.g., 'red', 'blue' for 'color')
        option.values.forEach((optionValue) => {
          const key = `${optionName}:${optionValue}`;
          newValidVariants.set(key, new Map());

          // Find all variants that have this exact option value
          const matchingVariants = product.variant.filter(
            (variant) => variant.options[optionName] === optionValue
          );

          // For each other option name
          sortedOptions.forEach((otherOption) => {
            const otherName = otherOption.name;
            if (otherName !== optionName) {
              // Get all valid values for this other option when the first option is selected
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

  // Get valid values for a given option based on other selections
  const getValidValuesForOption = useCallback(
    (optionName, value) => {
      // If no other options are selected, all values are valid
      const otherSelections = Object.entries(selectedVariantOption).filter(
        ([name]) => name !== optionName
      );

      if (otherSelections.length === 0) {
        return true;
      }

      // Check if this option value works with at least one existing selection
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

  // Handle reset of all selections
  const handleResetSelections = useCallback(() => {
    // Reset all selections
    Object.keys(selectedVariantOption).forEach((option) => {
      handleVariantSelection(option, null);
    });
  }, [selectedVariantOption, handleVariantSelection]);

  if (!variantOptions.length) return null;

  return (
    <Card className="mt-4 border-0 shadow-none">
      <CardContent className="space-y-4 p-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700">Options</p>
          {Object.keys(selectedVariantOption).length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-gray-500"
              onClick={handleResetSelections}
            >
              <Undo2 className="mr-1 h-3.5 w-3.5" />
              <span className="text-xs">Reset</span>
            </Button>
          )}
        </div>

        {variantOptions.map((option) => {
          // Find populated option type data that matches this option name
          // We scan through all variants and their optionTypes to find matching data
          const populatedOptionTypeInfo = product.variant
            .flatMap((v) => v.optionType || [])
            .find(
              (ot) =>
                ot.label?.toLowerCase() === option.name.toLowerCase() ||
                ot.labelId?.name?.toLowerCase() === option.name.toLowerCase()
            )?.labelId;

          // Use the values already aggregated by generateVariantOptions
          const optionValues = option.values;

          return (
            <div key={option.id} className="mb-4">
              <p className="mb-2 text-sm font-medium text-gray-700">
                <span className="capitalize">{option.name}</span>:{' '}
                <span className="font-bold uppercase">
                  {selectedVariantOption[option.name] || 'Select'}
                </span>
              </p>

              <div className="flex flex-wrap gap-3">
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

                    // Use swatchUrl if available from populated data
                    const swatchUrl = populatedOptionTypeInfo?.swatchUrl;

                    return (
                      <TooltipProvider key={value}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              className={cn(
                                'relative h-16 w-16 rounded-full transition-all duration-200',
                                isSelected
                                  ? 'ring-2 ring-primary ring-offset-2'
                                  : 'border border-gray-300',
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
                              aria-label={`Select color: ${value}`}
                            >
                              <div className="relative h-full w-full overflow-hidden rounded-full">
                                <Image
                                  src={imageUrl}
                                  alt={`${value} color`}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </div>
                              {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20">
                                  <Check className="h-5 w-5 text-white" />
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
                        className={cn(
                          'relative h-10 min-w-[2.5rem] max-w-[4rem] truncate border p-1 text-sm uppercase transition-all duration-200',
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
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
