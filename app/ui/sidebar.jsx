"use client";
import React, { useEffect, useState, useRef, memo } from "react";
import { useSidebarStore, useCategoryStore } from "@/store/store";
import { oswald } from "@/font";
import useSWR from "swr";
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
  const sidebarItems = [
    {
      label: "SALE",
      children: [
        { label: "SALE MEN", href: "/men/products" },
        { label: "SALE WOMEN", href: "/women/products" },
      ],
    },
    {
      label: "NEW ARRIVALS",
      href: "/new-arrivals/products",
    },
    {
      label: "MEN",
      children: [
        { label: "T-shirts", href: "/men/t-shirts" },
        { label: "Shirts", href: "/men/shirts" },
        { label: "Pants", href: "/men/pants" },
        { label: "Shoes", href: "/men/shoes" },
      ],
    },
    {
      label: "WOMEN",
      children: [
        { label: "Dresses", href: "/women/dresses" },
        { label: "Tops", href: "/women/tops" },
        { label: "Skirts", href: "/women/skirts" },
        { label: "Shoes", href: "/women/shoes" },
      ],
    },
    {
      label: "JEANS",
      href: "/jeans/products",
    },
    {
      label: "KIDSWEAR",
      children: [
        { label: "Boys", href: "/kids/boys" },
        { label: "Girls", href: "/kids/girls" },
      ],
    },
    {
      label: "SECONDHAND",
      href: "/secondhand/products",
    },
  ];
  // const curUICategory = useCartStore((state) => state.curUICategory);
  // const setCategory = useCategoryStore((state) => state.setCategory);
  // const categories = useCategoryStore((state) => state.categories);

  // const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  // const [expandedItems, setExpandedItems] = useState({});
  // // Use SWR to fetch categories based on the current UI category (slug)
  // const { data: categoryData, error: categoryError } = useSWR(
  //   curUICategory ? `/api/categories/${curUICategory}` : null,
  //   () => fetchCategories(curUICategory),
  //   {
  //     revalidateOnFocus: false,
  //     onSuccess: (fetchedData) => {
  //       setCategory(fetchedData);
  //     },
  //   },
  // );
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
  const openSidebar = useSidebarStore((state) => state.openSidebar);

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

  // useEffect(() => {
  //   if (categories) {
  //     const allExpanded = categories.reduce((acc, category) => {
  //       acc[category.id] = true;
  //       return acc;
  //     }, {});
  //     setExpandedItems(allExpanded);
  //   }
  // }, [categories]);

  // const toggleExpand = (categoryId) => {
  //   setExpandedItems((prevExpandedItems) => ({
  //     ...prevExpandedItems,
  //     [categoryId]: !prevExpandedItems[categoryId],
  //   }));
  // };

  const toggleExpand = (label) => {
    if (expandedItem === label) {
      setExpandedItem(null);
    } else {
      setExpandedItem(label);
    }
  };

  // if (categoryError)
  //   return <div>Failed to load categories: {categoryError.message}</div>;
  // if (!categoryData) return <div>Loading categories...</div>;

  // return (
  //   <aside
  //     className={`fixed left-0 top-0 z-10 mt-[60px] h-full w-[250px] bg-white text-black transition-transform duration-300 ${
  //       isSidebarOpen ? "visible translate-x-0" : "invisible -translate-x-full"
  //     } bg-white`}
  //   >
  //     <nav>
  //       <ul className={`${oswald.className} divide-y`}>
  //         {categories.map((category) => (
  //           <div key={category.id}>
  //             <li
  //               className={`cursor-pointer px-4 ${expandedItems[category.id] ? "pb-2 pt-5" : "py-5"}`}
  //               onClick={() => toggleExpand(category.id)}
  //             >
  //               <div className="flex items-center justify-between">
  //                 <Link href={`/${category.slug}`} className="uppercase">
  //                   {category.name}
  //                 </Link>
  //                 {category.children.length > 0 && (
  //                   <div className="cursor-pointer">
  //                     {expandedItems[category.id] ? <MinusIcon /> : <AddIcon />}
  //                   </div>
  //                 )}
  //               </div>
  //             </li>
  //             {category.children.length > 0 && (
  //               <ul
  //                 className={`ml-3 pl-4 pt-2 transition-all duration-300 ease-in-out ${
  //                   expandedItems[category.id] ? "block" : "hidden"
  //                 }`}
  //               >
  //                 {category.children.map((child) => (
  //                   <li key={child.id} className="py-1 text-sm capitalize">
  //                     <Link href={`/${child.slug}`}>{child.name}</Link>
  //                   </li>
  //                 ))}
  //               </ul>
  //             )}
  //           </div>
  //         ))}
  //       </ul>
  //     </nav>
  //   </aside>
  // );

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
            {sidebarItems.map((item, index) => (
              <li key={index} className="px-4 py-5">
                {item.children ? (
                  <>
                    <div
                      onClick={() => toggleExpand(item.label)}
                      className="flex items-center justify-between uppercase"
                    >
                      {item.label}
                      <span className="relative flex h-6 w-6 items-center justify-center">
                        <span className="h-0.5 w-3 bg-black transition-transform duration-300" />
                        <span
                          className={`absolute h-0.5 w-3 bg-black transition-transform duration-300 ${expandedItem === item.label ? "rotate-0" : "rotate-90"}`}
                        />
                      </span>
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
