"use client";

import useSWR from "swr";
import { useSidebarStore, useCategoryStore } from "@/store/store";
import { oswald } from "@/font";
import { useState, useEffect, memo } from "react";
import { getCategories } from "@/app/action/categoryAction";
import AddIcon from "@/public/assets/icons/add.svg";
import MinusIcon from "@/public/assets/icons/minus.svg";
import { useCartStore } from "@/store/store";
import Link from "next/link";

// Fetch categories from your server action
const fetchCategories = async (slug) => {
  return await getCategories(slug);
};

export default memo(function Sidebar() {
  const curUICategory = useCartStore((state) => state.curUICategory);
  const setCategory = useCategoryStore((state) => state.setCategory);
  const categories = useCategoryStore((state) => state.categories);

  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const [expandedItems, setExpandedItems] = useState({});
  // Use SWR to fetch categories based on the current UI category (slug)
  const { data: categoryData, error: categoryError } = useSWR(
    curUICategory ? `/categories/${curUICategory}` : null,
    () => fetchCategories(curUICategory),
    {
      revalidateOnFocus: false,
      onSuccess: (fetchedData) => {
        setCategory(fetchedData);
      },
    },
  );

  // Expand all categories by default
  useEffect(() => {
    if (categories) {
      const allExpanded = categories.reduce((acc, category) => {
        acc[category.id] = true;
        return acc;
      }, {});
      setExpandedItems(allExpanded);
    }
  }, [categories]);

  const toggleExpand = (categoryId) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [categoryId]: !prevExpandedItems[categoryId],
    }));
  };

  if (categoryError)
    return <div>Failed to load categories: {categoryError.message}</div>;
  if (!categoryData) return <div>Loading categories...</div>;

  return (
    <aside
      className={`h-full text-black transition-[transform,visible,invisible] duration-300 ${
        isSidebarOpen
          ? "visible w-[250px] translate-x-0"
          : "invisible w-0 -translate-x-full"
      } bg-white`}
    >
      <nav>
        <ul className={`${oswald.className} divide-y`}>
          {categories.map((category) => (
            <div key={category.id}>
              <li
                className={`cursor-pointer px-4 py-5 ${expandedItems[category.id] && category.children.length > 0 && "pb-2"}`}
                onClick={() => toggleExpand(category.id)}
              >
                <div className="flex items-center justify-between">
                  <Link href={`/${category.slug}`} className="uppercase">
                    {category.name}
                  </Link>
                  {category.children.length > 0 && (
                    <div className="cursor-pointer">
                      {expandedItems[category.id] ? <MinusIcon /> : <AddIcon />}
                    </div>
                  )}
                </div>
              </li>
              {category.children.length > 0 && (
                <ul
                  className={`ml-3 pb-2 pl-4 transition-all duration-300 ease-in-out ${
                    expandedItems[category.id] ? "block" : "hidden"
                  }`}
                >
                  {category.children.map((child) => (
                    <li key={child.id} className="py-1 text-sm capitalize">
                      <Link href={`/${child.slug}`}>{child.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </nav>
    </aside>
  );
});
