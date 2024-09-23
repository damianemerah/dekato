"use client";
import React, { useEffect, useState, memo } from "react";
import { useSidebarStore } from "@/store/store";
import { getAllCategories } from "@/app/action/categoryAction";
import { oswald } from "@/font";
import useSWR from "swr";

export default memo(function Sidebar() {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
  const openSidebar = useSidebarStore((state) => state.openSidebar);

  const { data: categories } = useSWR(
    "/sidebar/allCategories",
    getAllCategories,
    {
      revalidateOnFocus: false,
    },
  );

  const [isMobile, setIsMobile] = useState(false);

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

  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (label) => {
    if (expandedItem === label) {
      setExpandedItem(null);
    } else {
      setExpandedItem(label);
    }
  };

  const toggleIcon = (items, toggleItem) => (
    <span className="relative flex h-6 w-6 items-center justify-center">
      <span className="h-0.5 w-3 bg-black transition-transform duration-300" />
      <span
        className={`absolute h-0.5 w-3 bg-black transition-transform duration-300 ${items === toggleItem ? "rotate-0" : "rotate-90"}`}
      />
    </span>
  );

  const mapCategories = (categories) => {
    const topLevelCategories =
      categories?.filter((cat) => cat.parent === null) || [];

    return topLevelCategories.map((topCat) => ({
      label: topCat.name.toUpperCase(),
      href: `/${topCat.slug}/products`,
      children: categories
        ?.filter((cat) => cat.parent?.id === topCat.id)
        .map((subCat) => ({
          label: subCat.name,
          href: `/${subCat.slug}/products`,
        })),
    }));
  };

  const sidebarItems = mapCategories(categories);

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside
        className={`fixed left-0 top-0 z-10 mt-[60px] h-full w-[250px] bg-white text-black transition-transform duration-300 ${
          isSidebarOpen
            ? "visible translate-x-0"
            : "invisible -translate-x-full"
        }`}
      >
        <nav>
          <ul className={`${oswald.className} divide-y`}>
            {sidebarItems?.map((item, index) => (
              <li key={index} className="px-4 py-5">
                {item.children && item.children.length > 0 ? (
                  <>
                    <div
                      onClick={() => toggleExpand(item.label)}
                      className="flex items-center justify-between uppercase"
                    >
                      {item.label}
                      {toggleIcon(expandedItem, item.label)}
                    </div>
                    <ul
                      className={`transition-all duration-300 ease-in-out ${
                        expandedItem === item.label ? "block" : "hidden"
                      }`}
                    >
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex} className="p-2 text-sm">
                          <a href={child.href} className="">
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center justify-between"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
});
