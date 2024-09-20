"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { oswald } from "@/font";
import useSWRImmutable from "swr/immutable";
import { getAllCategories } from "@/app/action/categoryAction";
import { useCategoryStore } from "@/store/store";
import { Spin } from "antd";

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
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const [categorizedListState, setCategorizedListState] = useState([]);
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
      setCategorizedListState(categorizedItems[selectedCategory] || []);
    }
  }, [categories, categorizedItems, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCategorizedListState(categorizedItems[category] || []);
  };

  return (
    <div className={`mb-8 mt-4 px-14 py-5 ${oswald.className}`}>
      <div className="ml-8 flex flex-col gap-1">
        <h2 className="text-3xl">Selected Category</h2>
        <div className="mb-6 flex items-center gap-6">
          <p className="text-[13px] font-normal">Filter by:</p>
          <ul className="flex gap-4">
            <li
              className={`${selectedCategory === "women" ? "active__category" : ""} cursor-pointer`}
              onClick={() => handleCategoryChange("women")}
            >
              Women
            </li>
            <li
              className={`${selectedCategory === "men" ? "active__category" : ""} cursor-pointer`}
              onClick={() => handleCategoryChange("men")}
            >
              Men
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between">
        {isLoading ? (
          <Spin size="large" />
        ) : Array.isArray(categorizedListState) &&
          categorizedListState.length > 0 ? (
          categorizedListState
            .filter((category) => category.pinned)
            .map((category, index) => {
              console.log("Image URL:", category.image[0]); // Log the image URL
              return (
                <Link
                  href="#"
                  key={index}
                  className="m-2 flex min-w-[calc(18.33%-12px)] max-w-[calc(18.33%-12px)] flex-1 items-end justify-center !bg-cover pb-12 text-2xl font-bold text-white after:block after:pb-[100%]"
                  style={{
                    background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.2) 30%, rgba(0, 0, 0, 0.5) 50%), url('${category.image[0]}')`,

                    backgroundSize: "cover",
                  }}
                >
                  {category.name}
                </Link>
              );
            })
        ) : (
          <p>No categories available</p>
        )}
      </div>
    </div>
  );
}
