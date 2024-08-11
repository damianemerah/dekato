"use client";
// import React, { useEffect, useRef } from "react";
import { useSidebarStore } from "@/store/store";
import { oswald } from "@/font";
import { useState } from "react";

export default function Sidebar() {
  const sidebarItems = [
    {
      label: "SALE",
      children: [
        { label: "SALE MEN", href: "/shop/men/products" },
        { label: "SALE WOMEN", href: "/shop/women/products" },
      ],
    },
    {
      label: "NEW ARRIVALS",
      href: "/shop/new-arrivals/products",
    },
    {
      label: "MEN",
      children: [
        { label: "T-shirts", href: "/shop/men/t-shirts" },
        { label: "Shirts", href: "/shop/men/shirts" },
        { label: "Pants", href: "/shop/men/pants" },
        { label: "Shoes", href: "/shop/men/shoes" },
      ],
    },
    {
      label: "WOMEN",
      children: [
        { label: "Dresses", href: "/shop/women/dresses" },
        { label: "Tops", href: "/shop/women/tops" },
        { label: "Skirts", href: "/shop/women/skirts" },
        { label: "Shoes", href: "/shop/women/shoes" },
      ],
    },
    {
      label: "JEANS",
      href: "/shop/jeans/products",
    },
    {
      label: "KIDSWEAR",
      children: [
        { label: "Boys", href: "/shop/kids/boys" },
        { label: "Girls", href: "/shop/kids/girls" },
      ],
    },
    {
      label: "SECONDHAND",
      href: "/shop/secondhand/products",
    },
  ];

  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (label) => {
    if (expandedItem === label) {
      setExpandedItem(null);
    } else {
      setExpandedItem(label);
    }
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (navRef.current && !navRef.current.contains(event.target)) {
  //       // useSidebarStore.setState({ isSidebarOpen: false });
  //       console.log("clicked outside", isSidebarOpen);
  //     }
  //   };
  //   document.addEventListener("click", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  // const navRef = useRef(null);
  return (
    <aside
      className={`fixed left-0 top-0 z-10 mt-[60px] h-full w-[250px] bg-white text-black transition-transform duration-300 ${
        isSidebarOpen ? "visible translate-x-0" : "invisible -translate-x-full"
      }`}

      // ref={navRef}
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
                    <span>
                      {expandedItem === item.label ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#000"
                        >
                          <path d="M200-440v-80h560v80H200Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#000"
                        >
                          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                        </svg>
                      )}
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
  );
}
