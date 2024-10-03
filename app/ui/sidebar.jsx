"use client";
import React, { useEffect, useState, memo, useCallback } from "react";
import { useSidebarStore } from "@/store/store";
import { oswald } from "@/font";
import { usePathname } from "next/navigation";

export default memo(function Sidebar({ categories }) {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
  const openSidebar = useSidebarStore((state) => state.openSidebar);
  const [isMobile, setIsMobile] = useState(false);
  const lgScreenSidebar = useSidebarStore((state) => state.lgScreenSidebar);
  const setMenuIsClicked = useSidebarStore((state) => state.setMenuIsClicked);

  const pathname = usePathname();

  const handleResize = useCallback(() => {
    const isBelowThreshold = window.innerWidth < 1250;
    setIsMobile(isBelowThreshold);

    if (isBelowThreshold && !useSidebarStore.getState().menuIsClicked) {
      closeSidebar();
    }
    if (!isBelowThreshold && lgScreenSidebar) {
      openSidebar();
    }
    setMenuIsClicked(false);
  }, [closeSidebar, openSidebar, lgScreenSidebar, setMenuIsClicked]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (label) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  const toggleIcon = (items, toggleItem) => (
    <span className="relative flex h-6 w-6 items-center justify-center">
      <span className="h-0.5 w-3 bg-primary transition-transform duration-300" />
      <span
        className={`absolute h-0.5 w-3 bg-primary transition-transform duration-300 ${items === toggleItem ? "rotate-0" : "rotate-90"}`}
      />
    </span>
  );

  const mapCategories = (categories) => {
    const topLevelCategories =
      categories?.filter((cat) => cat.parent === null) || [];

    const removeParentPrefix = (name, parentName) => {
      const lowerName = name.toLowerCase();
      const lowerParentName = parentName.toLowerCase();
      if (
        lowerName.startsWith(`${lowerParentName}'s`) &&
        name.slice(parentName.length + 2).trim().length > 0
      ) {
        return name.slice(parentName.length + 2).trim();
      }
      if (
        lowerName.startsWith(lowerParentName) &&
        name.slice(parentName.length).trim().length > 0
      ) {
        return name.slice(parentName.length).trim();
      }
      return name;
    };

    return topLevelCategories.map((topCat) => ({
      label: topCat.name.toUpperCase(),
      href: `/${topCat.slug}/products`,
      children: categories
        ?.filter((cat) => cat.parent?.id === topCat.id)
        .map((subCat) => {
          const label = removeParentPrefix(subCat.name, topCat.name);
          return {
            label: label.charAt(0).toUpperCase() + label.slice(1),
            href: `/${topCat.slug}/${subCat.slug}`,
            children: categories
              ?.filter((cat) => cat.parent?.id === subCat.id)
              .map((childCat) => {
                const childLabel = removeParentPrefix(
                  childCat.name,
                  subCat.name,
                );
                return {
                  label:
                    childLabel.charAt(0).toUpperCase() + childLabel.slice(1),
                  href: `/${topCat.slug}/${subCat.slug}/${childCat.slug}`,
                };
              }),
          };
        }),
    }));
  };

  const sidebarItems = mapCategories(categories);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/account")
  ) {
    return null;
  }

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-primary opacity-50"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`${
          isSidebarOpen
            ? "visible min-w-[250px] translate-x-0"
            : "invisible w-0 -translate-x-full"
        } relative z-30 h-full flex-shrink-0 bg-white text-primary transition-all duration-300 ease-in-out`}
      >
        <nav className="">
          <ul className={`${oswald.className} divide-y`}>
            {sidebarItems?.map((item, index) => (
              <li key={index} className="px-4 py-5">
                {item.children && item.children.length > 0 ? (
                  <>
                    <div
                      onClick={() => toggleExpand(item.label)}
                      className="flex items-center justify-between font-bold uppercase tracking-widest"
                    >
                      {/* first:text-[#cc5500] */}
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
                          {child.children && child.children.length > 0 ? (
                            <>
                              <div
                                onClick={() => toggleExpand(child.label)}
                                className="flex items-center justify-between"
                              >
                                {child.label}
                                {toggleIcon(expandedItem, child.label)}
                              </div>
                              <ul
                                className={`transition-all duration-300 ease-in-out ${
                                  expandedItem === child.label
                                    ? "block"
                                    : "hidden"
                                }`}
                              >
                                {child.children.map(
                                  (grandChild, grandChildIndex) => (
                                    <li
                                      key={grandChildIndex}
                                      className="p-2 text-xs"
                                    >
                                      <a href={grandChild.href} className="">
                                        {grandChild.label}
                                      </a>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </>
                          ) : (
                            <a href={child.href} className="">
                              {child.label}
                            </a>
                          )}
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
