"use client";
import { useState, useEffect, useCallback, memo } from "react";
import useSWRImmutable from "swr/immutable";
import { getPinnedCategoriesByParent } from "@/app/action/categoryAction";
import { useCategoryStore, useRecommendMutateStore } from "@/store/store";
import dynamic from "next/dynamic";
import Campaign from "./Campaign";

const CategoryLink = dynamic(() => import("./category-link"), {
  ssr: false,
  loading: () => (
    <div className="relative aspect-square w-full overflow-hidden">
      <div className="absolute inset-0 animate-pulse bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/40" />
        <div className="absolute bottom-4 left-1/2 h-6 w-32 -translate-x-1/2 animate-pulse rounded bg-gray-300 sm:bottom-6 md:bottom-8 lg:bottom-10" />
      </div>
    </div>
  ),
});

export default memo(function HomeCategory() {
  const { selectedCategory, setSelectedCategory } = useCategoryStore(
    (state) => ({
      selectedCategory: state.selectedCategory,
      setSelectedCategory: state.setSelectedCategory,
    }),
  );
  const setShouldMutate = useRecommendMutateStore(
    (state) => state.setShouldMutate,
  );
  const [categorizedListState, setCategorizedListState] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const { data: categories, isLoading } = useSWRImmutable(
    selectedCategory
      ? `/api/pinnedCategories?parent=${selectedCategory}`
      : null,
    () => selectedCategory && getPinnedCategoriesByParent(selectedCategory),
    {
      revalidateOnFocus: false,
      refreshInterval: 1000 * 60 * 60,
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
      setShouldMutate(true);
    },
    [setSelectedCategory, setShouldMutate],
  );

  const handleScroll = useCallback(
    (direction) => {
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
    },
    [scrollPosition],
  );

  if (
    !isLoading &&
    (!Array.isArray(categorizedListState) || categorizedListState?.length === 0)
  ) {
    return null;
  }

  return (
    <>
      <div
        className={`min-h-[300px] px-4 py-6 font-oswald sm:px-6 lg:px-8`}
        id="selected-category"
      >
        <div className="flex flex-col sm:ml-4 md:ml-8">
          <h2>SHOP BY CATEGORY</h2>
          <div className="mb-4 mt-4 flex flex-wrap gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-4 md:gap-6">
            <p className="whitespace-nowrap text-sm font-bold tracking-wide text-grayText">
              Filter by:
            </p>
            <ul className="flex gap-4">
              {["women", "men"].map((category) => (
                <li
                  key={category}
                  className={`${
                    selectedCategory === category
                      ? "border-b-2 border-primary"
                      : ""
                  } cursor-pointer text-base font-bold uppercase tracking-wide`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative">
          <div
            id="category-container"
            className={`lg:no-scrollbar lg-gap-6 flex gap-2 overflow-x-auto scroll-smooth pb-4 sm:gap-4 lg:overflow-x-visible`}
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-1/3 flex-none md:w-1/4 lg:w-[calc(100%/5-16px)]"
                  >
                    <div className="aspect-square w-full animate-pulse bg-gray-200">
                      <div className="flex h-full items-end justify-center">
                        <div className="h-8 w-32 rounded bg-gray-300" />
                      </div>
                    </div>
                  </div>
                ))
              : categorizedListState.map((category, index) => (
                  <div
                    key={index}
                    className="w-1/3 flex-none md:w-1/4 lg:w-[calc(100%/5-16px)]"
                  >
                    <CategoryLink category={category} />
                  </div>
                ))}
          </div>
        </div>
      </div>
      <Campaign />
    </>
  );
});
