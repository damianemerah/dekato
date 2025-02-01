"use client";
import { useState, useEffect, useCallback, memo } from "react";
import { oswald } from "@/style/font";
import useSWRImmutable from "swr/immutable";
import { getPinnedCategoriesByParent } from "@/app/action/categoryAction";
import { useCategoryStore, useRecommendMutateStore } from "@/store/store";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Campaign from "./Campaign";

const CategoryLink = dynamic(() => import("./category-link"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square w-full animate-pulse items-end justify-center bg-gray-200 px-2 pb-4 sm:px-3 sm:pb-6 md:px-4 md:pb-8 lg:px-5 lg:pb-10">
      <div className="h-8 w-32 rounded bg-gray-300" />
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
        className={`${oswald.className} min-h-[300px] px-4 py-6 sm:px-6 lg:px-8`}
        id="selected-category"
      >
        <div className="ml-2 flex flex-col sm:ml-4 md:ml-8">
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
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 shadow-md transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            id="category-container"
            className="flex gap-4 overflow-x-auto scroll-smooth px-3 pb-4"
          >
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-1/2 flex-none sm:w-1/3 md:w-1/4 lg:w-1/5"
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
                    className="w-1/2 flex-none sm:w-1/3 md:w-1/4 lg:w-1/5"
                  >
                    <CategoryLink category={category} />
                  </div>
                ))}
            <button
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/80 p-2 shadow-md transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <Campaign />
    </>
  );
});
