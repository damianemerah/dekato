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

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
];

const fetcher = async (cat, searchParams) => {
  try {
    const productData = await getAllProducts(cat, searchParams);
    return productData;
  } catch (error) {
    message.error("Error fetching products: " + error.message);
    throw error;
  }
};

export default function Filter({ cat, searchParams }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    price: [],
    cat: [],
  });
  const [variantOptions, setVariantOptions] = useState([]);
  const [sort, setSort] = useState("relevance");
  const [filterStatus, setFilterStatus] = useState("idle");

  const router = useRouter();
  const dropdownRef = useRef(null);

  const { data: products, isLoading } = useSWR(
    [cat, searchParams],
    () => fetcher(cat, searchParams),
    {
      revalidateOnFocus: false,
    },
  );
  const id =
    products?.length > 0 &&
    products[0]?.category.find(
      (c) => c.slug.toLowerCase() === cat.toLowerCase(),
    )?.id;

  const { data: subCategories } = useSWR(id, () => id && getSubCategories(id), {
    revalidateOnFocus: false,
  });

  const { data: productVariants, isLoading: varIsLoading } = useSWR(
    `productsVariant${id}`,
    () => id && getVariantsByCategory(id),
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
        options: subCategories?.map((sub) => sub.slug) || [],
      },
    ],
    [variantOptions, subCategories],
  );

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
              [newKey]: Array.isArray(value) ? value : [value],
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
    console.log(value, "value");
    toggleDropdown("sort");
  };

  //find product price range and compute variants

  if (!isLoading && products.length === 0) {
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
    <>
      <div
        ref={dropdownRef}
        className="sticky top-[108px] z-10 flex h-14 w-full items-center justify-between bg-gray-100 px-8 shadow-md"
      >
        <div className="flex items-center">
          <p className="text-sm">Filter by:</p>
          <div className="ml-4 flex items-center justify-start space-x-2">
            {filters.map((filter) => (
              <div key={filter.name} className="relative">
                <button
                  onClick={() => toggleDropdown(filter.name)}
                  className={`flex items-center gap-2 px-3 py-1 text-sm font-medium ${activeDropdown === filter.name ? "bg-white" : ""}`}
                >
                  {filter.name === "cat"
                    ? "Category"
                    : filter.name.charAt(0).toUpperCase() +
                      filter.name.slice(1)}
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <span className="h-0.5 w-2 bg-black transition-transform duration-300" />
                    <span
                      className={`absolute h-0.5 w-2 bg-black transition-transform duration-300 ${activeDropdown === filter.name ? "rotate-0" : "rotate-90"}`}
                    />
                  </span>
                </button>

                {activeDropdown === filter.name && (
                  <div className="absolute left-0 flex w-max flex-col bg-white text-[#303030]">
                    {filter.options.map((option, index) => (
                      <label
                        key={index}
                        className="inline-flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100"
                      >
                        <div className="relative flex items-center">
                          <input
                            type={
                              filter.name === "price" ? "radio" : "checkbox"
                            }
                            name={filter?.name}
                            value={option.toLowerCase()}
                            onChange={(e) => handleChange(e, filter.name)}
                            checked={selectedFilters[filter.name]?.includes(
                              option.toLowerCase(),
                            )}
                            className={`peer relative h-5 w-5 cursor-pointer ${filter.name === "price" ? "" : "appearance-none"} border border-gray-900 transition-all checked:bg-gray-900`}
                          />
                          <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="1"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </span>
                        </div>
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <p className="text-sm">Sort:</p>
          <div className="relative ml-4">
            <button
              onClick={() => toggleDropdown("sort")}
              className={`flex items-center gap-2 px-3 py-1 text-sm font-medium ${
                activeDropdown === "sort" ? "bg-white" : ""
              } hover:bg-white`}
            >
              {sort}
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="h-0.5 w-2 bg-black transition-transform duration-300" />
                <span
                  className={`absolute h-0.5 w-2 bg-black transition-transform duration-300 ${
                    activeDropdown === "sort" ? "rotate-0" : "rotate-90"
                  }`}
                />
              </span>
            </button>

            {activeDropdown === "sort" && (
              <div className="absolute right-0 w-max bg-white">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`block w-full px-4 py-2 text-left text-sm ${
                      sort === option.value ? "font-medium" : ""
                    } hover:bg-gray-100`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedFilters && (
        <div className="mt-6 flex items-center px-6">
          <div className="ml-4 flex items-center justify-start space-x-3">
            {Object.entries(selectedFilters)?.map(([key, value]) =>
              value.length > 0 ? (
                <div
                  key={key}
                  className="flex items-center gap-2 rounded-3xl hover:bg-gray-100"
                >
                  <span className="flex items-center rounded-3xl border p-2 text-sm font-medium">
                    {value.map((item, index) => (
                      <span key={index}>
                        {`${item}${index < value.length - 1 ? ",\u00A0" : ""}`}
                      </span>
                    ))}

                    <button
                      onClick={() => {
                        setFilterStatus("active");
                        setSelectedFilters((prev) => ({
                          ...prev,
                          [key]: [],
                        }));
                        setFilterStatus("active");
                      }}
                      className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="#303030"
                      >
                        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                      </svg>
                    </button>
                  </span>
                </div>
              ) : null,
            )}
          </div>

          {filterStatus === "active" && (
            <button
              onClick={handleFilter}
              className="hdfxmen-cloth9.over:bg-primary-dark ml-3 bg-primary px-4 py-1.5 text-white"
            >
              Apply Filters
            </button>
          )}
        </div>
      )}
    </>
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
