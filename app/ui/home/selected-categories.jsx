"use client";
import { useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { oswald } from "@/font";
import useSWRImmutable from "swr/immutable";
import { getPinnedCategoriesByParent } from "@/app/action/categoryAction";
import { useCategoryStore } from "@/store/store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import { SmallSpinner } from "../spinner";

const CategoryLink = ({ category }) => (
  <Link
    href={category.slug}
    className="flex aspect-square w-full items-end justify-center !bg-cover px-2 pb-4 text-lg font-bold text-white sm:px-3 sm:pb-6 sm:text-xl md:px-4 md:pb-8 md:text-2xl lg:px-5 lg:pb-10"
    style={{
      background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.5) 50%), url('${category.image[0]}?w=400&h=400&q=75')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {category.name}
  </Link>
);

export default memo(function HomeCategory() {
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const [categorizedListState, setCategorizedListState] = useState([]);

  const { data: categories, isLoading } = useSWRImmutable(
    selectedCategory
      ? `/api/pinnedCategories?parent=${selectedCategory}`
      : null,
    () => getPinnedCategoriesByParent(selectedCategory),

    {
      revalidateOnFocus: false,
      refreshInterval: 1000 * 60 * 5, // 5 minutes
      onSuccess: (data) => {
        console.log(data, "data");
      },
    },
  );

  useEffect(() => {
    if (categories?.length > 0) {
      setCategorizedListState(categories);
    }
  }, [categories]);

  // setting the selected category (men, women) to local storage
  const handleCategoryChange = useCallback(
    (category) => {
      setSelectedCategory(category);
    },
    [setSelectedCategory],
  );

  if (
    !isLoading &&
    (!Array.isArray(categorizedListState) || categorizedListState.length === 0)
  ) {
    return null;
  }

  return (
    <div className={`mb-8 mt-4 py-5 ${oswald.className} px-4 sm:px-6 md:px-8`}>
      <div className="ml-2 flex flex-col gap-1 sm:ml-4 md:ml-8">
        <h2 className="mb-2 text-2xl text-primary sm:text-3xl">
          SELECTED CATEGORY
        </h2>
        <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-4 md:gap-6">
          <p className="whitespace-nowrap text-nowrap text-[12px] font-normal sm:text-[13px]">
            Filter by:
          </p>
          <ul className="flex gap-4">
            {["women", "men"].map((category) => (
              <li
                key={category}
                className={`${
                  selectedCategory === category ? "active__category" : ""
                } cursor-pointer text-sm uppercase sm:text-base`}
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isLoading ? (
        <SmallSpinner />
      ) : (
        <div className="relative">
          <Swiper
            modules={[Scrollbar, Mousewheel]}
            spaceBetween={15}
            slidesPerView={2}
            scrollbar={{
              hide: false,
              draggable: true,
              dragSize: 100,
            }}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: true,
              eventsTarget: "container",
              thresholdDelta: 50,
              thresholdTime: 100,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="px-3"
          >
            {categorizedListState.map((category, index) => (
              <SwiperSlide key={index}>
                <CategoryLink category={category} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      <style jsx global>{`
        .swiper-scrollbar {
          background: rgba(0, 0, 0, 0.1) !important;
          height: 3px !important;
        }
        .swiper-scrollbar-drag {
          background: rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
    </div>
  );
});
