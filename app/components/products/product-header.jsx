'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { getVariantsByCategory } from '@/app/action/productAction';
import { getSubCategories } from '@/app/action/categoryAction';
import { generateVariantOptions } from '@/app/utils/getFunc';
import FilterContent from './filter-content';
import { ButtonPrimary } from '../button';
import MobileFilterContent from './mobile-filter-content';
import { Filter as FilterIcon } from 'lucide-react';

const sortOptions = [
  { value: '+createdAt', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
];

const priceRanges = [
  { min: 0, max: 10000 },
  { min: 10000, max: 30000 },
  { min: 30000, max: 100000 },
  { min: 100000, max: Number.MAX_SAFE_INTEGER },
];

export default function Filter({
  cat,
  searchParams,
  showFilter,
  setShowFilter,
  products,
}) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchStr, setSearchStr] = useState('');
  const [variantOptions, setVariantOptions] = useState([]);

  const router = useRouter();
  const dropdownRef = useRef(null);

  const { data: subCategories } = useSWR(
    cat ? `subCat:${cat.join('|')}` : null,
    () => getSubCategories(cat),
    {
      revalidateOnFocus: false,
    }
  );

  const { data: productVariants, isLoading: varIsLoading } = useSWR(
    cat ? `productsVariant:${cat.join('|')}:${searchStr}` : null,
    () => cat && getVariantsByCategory(cat, searchStr),
    {
      revalidateOnFocus: false,
    }
  );

  const filters = useMemo(
    () => [
      {
        name: 'price',
        options: [
          '₦0 - ₦10000',
          '₦10000 - ₦30000',
          '₦30000 - ₦100000',
          '₦100000 - Above',
        ],
      },
      ...variantOptions,
      {
        name: 'cat',
        options: (subCategories && subCategories?.map((sub) => sub.slug)) || [],
      },
    ],
    [variantOptions, subCategories]
  );

  useEffect(() => {
    setSearchStr(searchParams.q);
  }, [searchParams.q]);

  useEffect(() => {
    if (!varIsLoading && productVariants) {
      const variantOptions = productVariants?.flatMap(
        (product) => product.variant
      );
      const variants = generateVariantOptions(variantOptions);

      setVariantOptions(
        variants.map(({ values, ...rest }) => ({ ...rest, options: values }))
      );
    }
  }, [varIsLoading, productVariants]);

  // Derive filter and sort state from searchParams
  const { currentFilters, currentSortValue, currentSortLabel } = useMemo(() => {
    // Initialize with mandatory filter types
    const filters = {
      price: [],
      cat: [],
    };

    // Dynamically add keys from variantOptions
    variantOptions.forEach((opt) => {
      filters[opt.name] = [];
    });

    const derivedSortValue = searchParams?.sort || '+createdAt'; // Default sort

    if (searchParams) {
      for (const [key, value] of Object.entries(searchParams)) {
        // Handle variant keys ending in '-vr'
        const filterKey = key.endsWith('-vr') ? key.replace('-vr', '') : key;

        if (filters.hasOwnProperty(filterKey)) {
          const values = Array.isArray(value) ? value : value.split(',');

          // For all filters except price, just copy the values
          if (filterKey !== 'price') {
            filters[filterKey] = values;
          }
          // Special handling for price filter
          else if (values.length > 0) {
            // Map from numeric range to display string
            const priceDisplayOptions = [
              '₦0 - ₦10000',
              '₦10000 - ₦30000',
              '₦30000 - ₦100000',
              '₦100000 - Above',
            ];

            // Parse the numeric values
            const min = parseInt(values[0], 10) || 0;
            const max =
              values.length > 1 && values[1] !== 'Above'
                ? parseInt(values[1], 10)
                : 'Above';

            // Find the correct price range
            let displayIndex = -1;
            if (max === 'Above') {
              // If max is 'Above', it's the last range
              if (min >= 100000) displayIndex = 3;
            } else {
              // Find the matching range based on min,max values
              displayIndex = priceRanges.findIndex(
                (range) => min >= range.min && max <= range.max
              );
            }

            // Set the display price string
            filters.price =
              displayIndex >= 0 ? [priceDisplayOptions[displayIndex]] : [];
          }
        }
      }
    }

    const sortLabel =
      sortOptions.find((opt) => opt.value === derivedSortValue)?.label ||
      'Newest';

    return {
      currentFilters: filters,
      currentSortValue: derivedSortValue,
      currentSortLabel: sortLabel,
    };
  }, [searchParams, variantOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Refactored handleChange to use URL state
  const handleChange = useCallback(
    (e, name) => {
      const { value, checked } = e.target;

      // Create a new URLSearchParams object from the current searchParams
      const currentParams = new URLSearchParams(
        typeof searchParams === 'object'
          ? Object.entries(searchParams).reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {})
          : searchParams
      );

      // Get existing values from URL params
      const paramKey = variantOptions.some((opt) => opt.name === name)
        ? `${name}-vr`
        : name;

      const existingValues = currentParams.get(paramKey)?.split(',') || [];

      let newValues;
      if (name === 'price') {
        // Price is radio-like, only one value at a time
        newValues = checked ? [value] : [];

        // Convert display price to actual min/max values
        if (checked && value) {
          const priceRange = value.replace(/₦|\s/g, '').split('-');
          const min = priceRange[0];
          // Handle 'Above' special case
          const max = priceRange[1] === 'Above' ? 'Above' : priceRange[1];

          // Use numeric min,max format as expected by the API
          currentParams.set('price', `${min},${max}`);

          // Reset page when filters change
          currentParams.set('page', '1');

          // Push the new route
          router.push(`/shop/${cat.join('/')}?${currentParams.toString()}`);
          return;
        }
      } else {
        // For other filters, add or remove the value
        newValues = checked
          ? [...existingValues, value]
          : existingValues.filter((item) => item !== value);
      }

      // Update the params
      if (newValues.length > 0) {
        currentParams.set(paramKey, newValues.join(','));
      } else {
        currentParams.delete(paramKey);
      }

      // Reset page when filters change
      currentParams.set('page', '1');

      // Push the new route
      router.push(`/shop/${cat.join('/')}?${currentParams.toString()}`);
    },
    [searchParams, router, cat, variantOptions]
  );

  // Refactored handleSortChange to use URL state
  const handleSortChange = useCallback(
    (value) => {
      // Create a new URLSearchParams object from the current searchParams
      const currentParams = new URLSearchParams(
        typeof searchParams === 'object'
          ? Object.entries(searchParams).reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {})
          : searchParams
      );

      // Update or add the sort parameter
      currentParams.set('sort', value);

      // Reset page when sort changes
      currentParams.set('page', '1');

      // Close dropdown before navigation
      toggleDropdown('sort');

      // Push the new route
      router.push(`/shop/${cat.join('/')}?${currentParams.toString()}`);
    },
    [cat, router, searchParams]
  );

  if (products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-grayText mb-6 text-center font-roboto text-xl">
          No products found.
        </p>
        <ButtonPrimary className="w-fit" onClick={() => window.history.back()}>
          Return to Previous Page
        </ButtonPrimary>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm">
      <button
        className="flex w-full items-center justify-center gap-2 bg-secondary py-2 text-center text-primary underline sm:hidden"
        onClick={() => {
          setShowFilter(true);
        }}
      >
        <FilterIcon className="h-4 w-4" />
        <span>Filter & Sort</span>
      </button>
      <FilterContent
        dropdownRef={dropdownRef}
        activeDropdown={activeDropdown}
        selectedFilters={currentFilters}
        sort={currentSortLabel}
        sortOptions={sortOptions}
        handleChange={handleChange}
        handleSortChange={handleSortChange}
        filters={filters}
        toggleDropdown={toggleDropdown}
        cat={cat}
        router={router}
        variantOptions={variantOptions}
        searchParams={searchParams}
      />
      <MobileFilterContent
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        selectedFilters={currentFilters}
        filters={filters}
        handleChange={handleChange}
        cat={cat}
        router={router}
        sort={currentSortLabel}
        sortOptions={sortOptions}
        handleSortChange={handleSortChange}
        searchParams={searchParams}
      />
    </div>
  );
}
