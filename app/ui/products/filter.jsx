"use client";
import { useState, useEffect, useRef, useMemo, use } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  getAllProducts,
  getVariantsByCategory,
} from "@/app/action/productAction";
import { getSubCategories } from "@/app/action/categoryAction";
import { generateVariantOptions } from "@/utils/getFunc";
import FilterContent from "./filter-content";
import { useProductStore, useSearchStore } from "@/store/store";

const sortOptions = [
  { value: "+createdAt", label: "Relevance" },
  { value: "price", label: "Price: Low to High" }, // Ascending
  { value: "-price", label: "Price: High to Low" }, // Descending
];

export default function Filter({ cat, searchParams }) {
  const catName = cat.slice(-1)[0].toLowerCase();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    cat: [],
  });
  const [searchStr, setSearchStr] = useState("");
  const [variantOptions, setVariantOptions] = useState([]);
  const [sort, setSort] = useState("relevance");
  const [filterStatus, setFilterStatus] = useState("idle");

  const router = useRouter();
  const dropdownRef = useRef(null);

  const products = useProductStore((state) => state.products);
  const isLoading = useProductStore((state) => state.isLoading);

  const { data: subCategories } = useSWR(
    catName ? catName : null,
    () => getSubCategories(catName),
    {
      revalidateOnFocus: false,
    },
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
        variants.map((v) => {
          const { values, ...rest } = v;
          return { ...rest, options: values };
        }),
      );

      setSelectedFilters((prev) => {
        const newFilters = { ...prev };

        variants.forEach((variant) => {
          if (variant.name in newFilters) {
            return;
          }

          newFilters[variant.name] = [];
        });

        return newFilters;
      });
    }
  }, [varIsLoading, productVariants]);

  useEffect(() => {
    // Handle prefill searchparams with variant options
    if (searchParams && !isLoading) {
      setFilterStatus("idle");
      const params = { ...searchParams };

      for (const [key, value] of Object.entries(params)) {
        const newKey = key.endsWith("-vr") ? key.split("-vr")[0] : key;
        const curFilter = variantOptions.find(
          (filter) => filter.name === newKey,
        );

        if (newKey === "price") {
          const priceRanges = [
            { min: 0, max: 10000 },
            { min: 10000, max: 30000 },
            { min: 30000, max: 100000 },
            { min: 100000, max: Number.MAX_SAFE_INTEGER },
          ];
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
          setSelectedFilters((prev) => {
            if (!curFilter && newKey !== "cat") {
              return prev;
            }
            return {
              ...prev,
              [newKey]: Array.isArray(value)
                ? value.split(",")
                : value.split(","),
            };
          });
        }
      }
    }
  }, [searchParams, variantOptions, filters, isLoading]);

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

  const handleChange = (e, name) => {
    setFilterStatus("active");
    const { value, checked } = e.target;

    setSelectedFilters((prev) => {
      let updatedFilter;

      if (name === "price" || name === "cat") {
        updatedFilter = checked ? [value] : [];
      } else {
        const currentFilter = prev[name] || [];
        updatedFilter = checked
          ? [...currentFilter, value]
          : currentFilter.filter((item) => item !== value);
      }

      return {
        ...prev,
        [name]: updatedFilter,
      };
    });
  };

  const handleFilter = () => {
    filterStatus === "idle" && setFilterStatus("active");
    const queryObj = Object.fromEntries(
      Object.entries(selectedFilters).filter(([key, value]) => {
        return (
          value.length > 0 &&
          value.every((v) => v.length > 0) &&
          key in selectedFilters
        );
      }),
    );

    if (Object.keys(queryObj).length === 0) {
      setFilterStatus("idle");
      return router.push(`/${cat}`);
    }

    for (const [key, value] of Object.entries(queryObj)) {
      if (variantOptions.some((opt) => opt.name === key)) {
        const newKey = key + "-vr";
        queryObj[newKey] = value;
        delete queryObj[key];
      }
    }

    const searchParams = createSearchParams(queryObj);
    router.push(`/${cat}?${searchParams}`);
  };

  const handleSortChange = (value) => {
    setSort(value);
    const params = new URLSearchParams(window.location.search);
    params.set("sort", value);

    router.push(`/${cat}?${params.toString()}`);
    toggleDropdown("sort");
  };

  //find product price range and compute variants

  if (!isLoading && products?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <p className="mb-4 text-center text-lg text-gray-700">
          Sorry, no products were found matching your filters.
        </p>
        <button
          onClick={() => window.history.back()}
          className="rounded bg-primary px-4 py-2 text-white"
        >
          Go Back
        </button>
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
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      handleFilter={handleFilter}
      handleChange={handleChange}
      handleSortChange={handleSortChange}
      filters={filters}
      toggleDropdown={toggleDropdown}
    />
  );
}

function createSearchParams(params) {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const valueArray = params[key];
      if (key === "price") {
        const formattedPrice = valueArray.map((priceRange) =>
          priceRange.replace(/₦|\s/g, "").split("-"),
        );
        searchParams.set(key, formattedPrice.join(","));
      } else {
        searchParams.set(key, valueArray.join(","));
      }
    }
  }

  return searchParams.toString();
}
