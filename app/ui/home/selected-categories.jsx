"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { oswald } from "@/style/font";
import useSWRImmutable from "swr/immutable";
import { getPinnedCategoriesByParent } from "@/app/action/categoryAction";
import { useCategoryStore } from "@/store/store";
import dynamic from "next/dynamic";

const CategoryLink = dynamic(() => import("./category-link"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full animate-pulse items-end justify-center bg-gray-200 px-2 pb-4 sm:px-3 sm:pb-6 md:px-4 md:pb-8 lg:px-5 lg:pb-10">
      <div className="h-8 w-32 rounded bg-gray-300" />
    </div>
  ),
});

export default memo(function HomeCategory() {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const [categorizedListState, setCategorizedListState] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const { data: categories, isLoading } = useSWRImmutable(
    selectedCategory
      ? `/api/pinnedCategories?parent=${selectedCategory}`
      : null,
    () => selectedCategory && getPinnedCategoriesByParent(selectedCategory),
    {
      revalidateOnFocus: false,
      refreshInterval: 1000 * 60 * 5,
    },
  );

  useEffect(() => {
    if (categories?.length > 0) {
      setCategorizedListState(categories);
    }
  }, [categories]);

  const handleCategoryChange = useCallback(
    (category) => {
      setSelectedCategory(category);
    },
    [setSelectedCategory],
  );

  const handleScroll = (direction) => {
    const container = document.getElementById("category-container");
    const scrollAmount = 300;

    if (direction === "left") {
      container.scrollTo({
        left: Math.max(0, scrollPosition - scrollAmount),
        behavior: "smooth",
      });
    } else {
      container.scrollTo({
        left: scrollPosition + scrollAmount,
        behavior: "smooth",
      });
    }

    setScrollPosition(container.scrollLeft);
  };

  if (
    !isLoading &&
    (!Array.isArray(categorizedListState) || categorizedListState?.length === 0)
  ) {
    return null;
  }

  return (
    <div
      className={`mb-8 mt-4 py-5 ${oswald.className} min-h-[300px] px-4 sm:px-6 md:px-8`}
    >
      <div className="ml-2 flex flex-col gap-1 sm:ml-4 md:ml-8">
        <h2 className="mb-2 text-2xl text-primary sm:text-3xl">
          SELECTED CATEGORY
        </h2>
        <div className="mb-4 flex gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-4 md:gap-6">
          <p className="whitespace-nowrap text-nowrap text-[13px] font-bold tracking-wide text-grayText">
            Filter by:
          </p>
          <ul className="flex gap-4">
            {["women", "men"].map((category) => (
              <li
                key={category}
                className={`${
                  selectedCategory === category ? "active__category" : ""
                } cursor-pointer text-sm font-bold uppercase tracking-wide sm:text-base`}
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 shadow-md hover:bg-white"
          aria-label="Scroll left"
        >
          ←
        </button>

        <div
          id="category-container"
          className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth px-3 pb-4"
        >
          {categorizedListState.map((category, index) => (
            <div
              key={index}
              className="w-1/2 flex-none sm:w-1/3 md:w-1/4 lg:w-1/5"
            >
              <CategoryLink category={category} />
            </div>
          ))}
        </div>

        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 shadow-md hover:bg-white"
          aria-label="Scroll right"
        >
          →
        </button>
      </div>
    </div>
  );
});
