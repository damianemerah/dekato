"use client";

import useSWR from "swr";
import { useSidebarStore, useCategoryStore } from "@/store/store";
import { oswald } from "@/font";
import { useState, useEffect } from "react";
import { getCategories } from "@/app/action/categoryAction";
import AddIcon from "@/public/assets/icons/add.svg";
import MinusIcon from "@/public/assets/icons/minus.svg";
import { useCartStore } from "@/store/store";
import Link from "next/link";

// Fetch categories from your server action
const fetchCategories = async (slug) => {
  return await getCategories(slug);
};

export default function Sidebar() {
  const curUICategory = useCartStore((state) => state.curUICategory);
  const setCategory = useCategoryStore((state) => state.setCategory);
  const categories = useCategoryStore((state) => state.categories);

  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const [expandedItems, setExpandedItems] = useState({});
  // Use SWR to fetch categories based on the current UI category (slug)
  const { data: categoryData, error: categoryError } = useSWR(
    curUICategory ? `/api/categories/${curUICategory}` : null,
    () => fetchCategories(curUICategory),
    {
      revalidateOnFocus: false,
      onSuccess: (fetchedData) => {
        setCategory(fetchedData);
      },
    },
  );

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
      className={`fixed left-0 top-0 z-10 mt-[60px] h-full w-[250px] text-black transition-transform duration-300 ${
        isSidebarOpen ? "visible translate-x-0" : "invisible -translate-x-full"
      } bg-white`}
    >
      <nav>
        <ul className={`${oswald.className} divide-y`}>
          {categories.map((category) => (
            <div key={category.id}>
              <li
                className={`cursor-pointer px-4 ${expandedItems[category.id] ? "pb-2 pt-5" : "py-5"}`}
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
                  className={`ml-3 pl-4 pt-2 transition-all duration-300 ease-in-out ${
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
}
