"use client";
import React, { useEffect, useState, memo } from "react";
import { useSidebarStore } from "@/store/store";
import { fetchAllCategories } from "@/app/action/categoryAction";
import { oswald } from "@/font";
import useSWR from "swr";

export default memo(function Sidebar() {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
  const openSidebar = useSidebarStore((state) => state.openSidebar);

  const { data: categories } = useSWR(
    "/sidebar/allCategories",
    fetchAllCategories,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => console.log(data),
    },
  );

  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const handleResize = () => {
      const isBelowThreshold = window.innerWidth < 1250;
      setIsMobile(isBelowThreshold);

      if (isBelowThreshold) {
        closeSidebar();
      } else if (localStorage.getItem("sidebar-storage") === "true") {
        openSidebar();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeSidebar, openSidebar]);

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCategories = (categories, depth = 0) => {
    if (!categories || depth > 3) return null;

    console.log(categories);

    return categories.map((category) => (
      <li key={category.id} className={`px-4 py-5 ${depth > 0 ? "ml-4" : ""}`}>
        <div
          onClick={() => toggleExpand(category.id)}
          className="flex cursor-pointer items-center justify-between uppercase"
        >
          {category.name}
          {category.children && category.children.length > 0 && (
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="h-0.5 w-3 bg-black transition-transform duration-300" />
              <span
                className={`absolute h-0.5 w-3 bg-black transition-transform duration-300 ${
                  expandedItems[category.id] ? "rotate-0" : "rotate-90"
                }`}
              />
            </span>
          )}
        </div>
        {category.children && category.children.length > 0 && (
          <ul
            className={`transition-all duration-300 ease-in-out ${
              expandedItems[category.id] ? "block" : "hidden"
            }`}
          >
            {renderCategories(category.children, depth + 1)}
          </ul>
        )}
      </li>
    ));
  };

  const pinnedCategories =
    categories?.filter(
      (category) => category.pinned && category.parent === null,
    ) || [];
  const unpinnedCategories =
    categories?.filter(
      (category) => !category.pinned && category.parent === null,
    ) || [];

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-[250px] bg-white text-black transition-transform duration-300 ${
          isSidebarOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full"
        }`}
        style={{ paddingTop: "4rem" }} // Adjust this value based on your header and promo bar height
      >
        <nav className="h-full overflow-y-auto">
          <ul className={`${oswald.className} divide-y`}>
            {renderCategories(pinnedCategories)}
            {renderCategories(unpinnedCategories)}
          </ul>
        </nav>
      </aside>
    </>
  );
});
