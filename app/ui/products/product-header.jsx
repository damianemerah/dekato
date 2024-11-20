"use client";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { getVariantsByCategory } from "@/app/action/productAction";
import { getSubCategories } from "@/app/action/categoryAction";
import { generateVariantOptions } from "@/utils/getFunc";
import FilterContent from "./filter-content";
import { ButtonPrimary } from "../button";
import { createSearchParams } from "@/utils/filterHelpers";

const sortOptions = [
  { value: "+createdAt", label: "Relevance" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
];

const priceRanges = [
  { min: 0, max: 10000 },
  { min: 10000, max: 30000 },
  { min: 30000, max: 100000 },
  { min: 100000, max: Number.MAX_SAFE_INTEGER },
];

export default function Filter({ cat, searchParams, products, banner }) {
  const catName = cat.slice(-1)[0].toLowerCase();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    cat: [],
  });
  const [searchStr, setSearchStr] = useState("");
  const [variantOptions, setVariantOptions] = useState([]);
  const [sort, setSort] = useState("relevance");

  const router = useRouter();
  const dropdownRef = useRef(null);

  const { data: subCategories } = useSWR(
    catName ? catName : null,
    () => getSubCategories(catName),
    { revalidateOnFocus: false },
  );

  const { data: productVariants, isLoading: varIsLoading } = useSWR(
    catName ? `productsVariant:${catName}:${searchStr}` : null,
    () => catName && getVariantsByCategory(catName, searchStr),
    {
      revalidateOnFocus: false,
    },
  );

  const filters = useMemo(
    () => [
      {
        name: "price",
        options: [
          "₦0 - ₦10000",
          "₦10000 - ₦30000",
          "₦30000 - ₦100000",
          "₦100000 - Above",
        ],
      },
      ...variantOptions,
      {
        name: "cat",
        options: (subCategories && subCategories?.map((sub) => sub.slug)) || [],
      },
    ],
    [variantOptions, subCategories],
  );

  useEffect(() => {
    setSearchStr(searchParams.q);
  }, [searchParams.q]);

  useEffect(() => {
    const sortParam = searchParams.sort;
    if (sortParam) {
      setSort(sortOptions.find((opt) => opt.value === sortParam)?.label);
    }
  }, [searchParams.sort]);

  useEffect(() => {
    if (!varIsLoading && productVariants) {
      const variantOptions = productVariants
        ?.map((product) => product.variant)
        .flat();
      const variants = generateVariantOptions(variantOptions);

      setVariantOptions(
        variants.map(({ values, ...rest }) => ({ ...rest, options: values })),
      );

      setSelectedFilters((prev) => {
        const newFilters = { ...prev };
        variants.forEach((variant) => {
          if (!(variant.name in newFilters)) {
            newFilters[variant.name] = [];
          }
        });
        return newFilters;
      });
    }
  }, [varIsLoading, productVariants]);

  useEffect(() => {
    if (searchParams) {
      const params = { ...searchParams };

      for (const [key, value] of Object.entries(params)) {
        const newKey = key.endsWith("-vr") ? key.split("-vr")[0] : key;
        const curFilter = variantOptions.find(
          (filter) => filter.name === newKey,
        );

        if (newKey === "price") {
          const priceValue = value
            .split(",")
            .map((price) => (isFinite(price) ? parseInt(price) : "Above"));

          const selectedPriceIndex = priceRanges.findIndex(
            (range) =>
              priceValue[0] >= range.min &&
              (priceValue[1] === "Above"
                ? Number.MAX_SAFE_INTEGER
                : priceValue[1]) <= range.max,
          );

          setSelectedFilters((prev) => ({
            ...prev,
            price: filters[0].options[selectedPriceIndex]
              ? [filters[0].options[selectedPriceIndex]]
              : [],
          }));
        } else if (curFilter || newKey === "cat") {
          setSelectedFilters((prev) => ({
            ...prev,
            [newKey]: Array.isArray(value) ? value : value.split(","),
          }));
        }
      }
    }
  }, [searchParams, variantOptions, filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleChange = useCallback(
    (e, name) => {
      const { value, checked } = e.target;

      let updatedFilter;
      if (name === "price") {
        updatedFilter = checked ? [value] : [];
      } else {
        const currentFilter = selectedFilters[name] || [];
        updatedFilter = checked
          ? [...currentFilter, value]
          : currentFilter.filter((item) => item !== value);
      }

      const newFilters = { ...selectedFilters, [name]: updatedFilter };

      setSelectedFilters(newFilters);

      // Handle navigation after state update
      const queryObj = Object.fromEntries(
        Object.entries(newFilters).filter(
          ([key, value]) =>
            value.length > 0 &&
            value.every((v) => v.length > 0) &&
            key in newFilters,
        ),
      );

      if (Object.keys(queryObj).length === 0) {
        router.push(`/${cat}`);
        return;
      }

      for (const [key, value] of Object.entries(queryObj)) {
        if (variantOptions.some((opt) => opt.name === key)) {
          queryObj[key + "-vr"] = value;
          delete queryObj[key];
        }
      }

      const searchParams = createSearchParams(queryObj);
      router.push(`/${cat}?${searchParams}`);
    },
    [cat, router, variantOptions, selectedFilters],
  );

  const handleSortChange = useCallback(
    (value) => {
      setSort(value);
      const params = new URLSearchParams(window.location.search);
      params.set("sort", value);

      // Close dropdown before navigation
      toggleDropdown("sort");
      router.push(`/${cat}?${params.toString()}`);
    },
    [cat, router],
  );

  if (products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="mb-6 text-center font-roboto text-xl text-grayText">
          No products found.
        </p>
        <ButtonPrimary className="w-fit" onClick={() => window.history.back()}>
          Return to Previous Page
        </ButtonPrimary>
      </div>
    );
  }

  return (
    <FilterContent
      dropdownRef={dropdownRef}
      activeDropdown={activeDropdown}
      selectedFilters={selectedFilters}
      setSelectedFilters={setSelectedFilters}
      sort={sort}
      sortOptions={sortOptions}
      handleChange={handleChange}
      handleSortChange={handleSortChange}
      filters={filters}
      toggleDropdown={toggleDropdown}
      cat={cat}
      router={router}
      variantOptions={variantOptions}
    />
  );
}
