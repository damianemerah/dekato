"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import image3 from "@/public/assets/image3.png";
import { oswald } from "@/font";
import useSWRImmutable from "swr/immutable";
import { getAllCategories } from "@/app/action/categoryAction";

const getCategoryHierarchy = (category, categories) => {
  if (!category.parent) {
    return [category];
  }
  const parent = categories.find((cat) => cat.id === category.parent.id);
  return [...getCategoryHierarchy(parent, categories), category];
};

const getTopLevelCategory = (category, categories) => {
  const hierarchy = getCategoryHierarchy(category, categories);
  return hierarchy[0];
};

export default function HomeCategory() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categorizedListState, setCategorizedListState] = useState({});

  const { data: categories, isLoading } = useSWRImmutable(
    "/api/allCategories",
    getAllCategories,
  );

  const categorizedItems = useMemo(
    () =>
      categories?.reduce((acc, category) => {
        const topLevel = getTopLevelCategory(category, categories);
        if (topLevel) {
          const key = topLevel.name.toLowerCase();
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(category);
        }
        return acc;
      }, {}),
    [categories],
  );

  useEffect(() => {
    if (categories && categories.length > 0) {
      const initialCategory = "women";
      setSelectedCategory(initialCategory);
      console.log(categorizedItems[initialCategory]);
      setCategorizedListState(categorizedItems[initialCategory]);
    }
  }, [categories, categorizedItems]);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.activeIndex);
    setTotalSlides(swiper.slides.length);
  };

  return (
    <div className={`mb-8 mt-4 px-6 py-5 ${oswald.className}`}>
      <div className="ml-8 flex flex-col gap-1">
        <h2 className="text-3xl">Selected Category</h2>
        <div className="mb-6 flex items-center gap-6">
          <p className="text-[13px] font-normal">Filter by:</p>
          <ul className="flex gap-4">
            <li
              className={`${selectedCategory === "women" ? "active__category" : ""} cursor-pointer`}
              onClick={() => {
                if (!categories) return;
                setSelectedCategory("women");
                setCategorizedListState(categorizedItems["women"]);
              }}
            >
              Women
            </li>
            <li
              className={`${selectedCategory === "men" ? "active__category" : ""} cursor-pointer`}
              onClick={() => {
                if (!categories) return;
                setSelectedCategory("men");
                setCategorizedListState(categorizedItems["men"]);
              }}
            >
              Men
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between gap-7">
        {Array.isArray(categorizedListState) &&
        categorizedListState.length > 0 ? (
          categorizedListState
            .filter((category) => category.pinned)
            .map((category, index) => (
              <Link
                href="#"
                key={index}
                style={{
                  background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.5) 50%), url('${category.image[0]}')`,
                  backgroundSize: "cover",
                }}
                className="m-2 flex min-w-[calc(20%-10px)] flex-1 items-center justify-center bg-[#E9D2FF] text-3xl text-white after:block after:pb-[100%]"
              >
                {category.name}
              </Link>
            ))
        ) : (
          <p>No categories available</p>
        )}
      </div>

      <div className="swiper-button-prev hidden md:flex"></div>
      <div className="swiper-button-next hidden md:flex"></div>
    </div>
  );
}
