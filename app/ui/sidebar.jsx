"use client";
import React, { useEffect, useState, memo, useCallback } from "react";
import { useSidebarStore, useUserStore } from "@/store/store";
import { oswald } from "@/font";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { signOut } from "next-auth/react";
export default memo(function Sidebar({ categories, collections }) {
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);
  const closeSidebar = useSidebarStore((state) => state.closeSidebar);
  const openSidebar = useSidebarStore((state) => state.openSidebar);
  const [isMobile, setIsMobile] = useState(false);
  const lgScreenSidebar = useSidebarStore((state) => state.lgScreenSidebar);
  const setLgScreenSidebar = useSidebarStore(
    (state) => state.setLgScreenSidebar,
  );
  const setMenuIsClicked = useSidebarStore((state) => state.setMenuIsClicked);
  const setUser = useUserStore((state) => state.setUser);
  const pathname = usePathname();

  const handleResize = useCallback(() => {
    const isBelowThreshold = window.innerWidth < 1250;
    setIsMobile(isBelowThreshold);

    if (isBelowThreshold && !useSidebarStore.getState().menuIsClicked) {
      closeSidebar();
    }
    if (!isBelowThreshold && lgScreenSidebar && !pathname.startsWith("/cart")) {
      openSidebar();
    }
    setMenuIsClicked(false);
  }, [closeSidebar, openSidebar, lgScreenSidebar, setMenuIsClicked, pathname]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (
      pathname.startsWith("/cart") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/forgot-password")
    ) {
      closeSidebar();
      setLgScreenSidebar(false);
    }
  }, [pathname, closeSidebar, setLgScreenSidebar]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
    setUser(null);
  };

  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (label) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  const toggleIcon = (expandedItem, toggleItem) => (
    <span className="relative flex h-6 w-6 items-center justify-center">
      <span className="h-0.5 w-3 bg-primary transition-transform duration-300" />
      <span
        className={`absolute h-0.5 w-3 bg-primary transition-transform duration-300 ${expandedItem === toggleItem ? "rotate-0" : "rotate-90"}`}
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
      href: `/${topCat.slug}`,
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

  // Add collections to sidebar items
  const collectionsItem = {
    label: "COLLECTIONS",
    children: collections?.map((collection) => ({
      label: collection.name,
      href: `/${collection.slug}`,
    })),
  };

  sidebarItems.push(collectionsItem);

  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
    return null;
  }

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`${
          isSidebarOpen
            ? "visible min-w-[250px] translate-x-0"
            : "invisible w-0 -translate-x-full"
        } relative z-30 h-full flex-shrink-0 bg-white text-primary shadow-lg transition-all duration-300 ease-in-out`}
      >
        <nav className="h-full overflow-y-auto">
          <ul className={`${oswald.className} divide-y divide-gray-200`}>
            {sidebarItems?.map((item, index) => (
              <li key={index} className="px-6 py-4">
                {item.children && item.children.length > 0 ? (
                  <>
                    <div
                      onClick={() => toggleExpand(item.label)}
                      className="flex cursor-pointer items-center justify-between text-sm font-bold uppercase tracking-wider text-gray-800 hover:text-primary"
                    >
                      {item.label}
                      {toggleIcon(expandedItem, item.label)}
                    </div>
                    <ul
                      className={`mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                        expandedItem === item.label ? "block" : "hidden"
                      }`}
                    >
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex} className="pl-4">
                          {child.children && child.children.length > 0 ? (
                            <>
                              <div
                                onClick={() => toggleExpand(child.label)}
                                className="flex cursor-pointer items-center justify-between py-2 text-sm text-gray-600 hover:text-primary"
                              >
                                {child.label}
                                {toggleIcon(expandedItem, child.label)}
                              </div>
                              <ul
                                className={`ml-4 space-y-2 transition-all duration-300 ease-in-out ${
                                  expandedItem === child.label
                                    ? "block"
                                    : "hidden"
                                }`}
                              >
                                {child.children.map(
                                  (grandChild, grandChildIndex) => (
                                    <li
                                      key={grandChildIndex}
                                      className="py-1 text-xs"
                                    >
                                      <Link
                                        href={grandChild.href}
                                        className="text-gray-500 hover:text-primary"
                                      >
                                        {grandChild.label}
                                      </Link>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </>
                          ) : (
                            <Link
                              href={child.href}
                              className="block py-2 text-sm text-gray-600 hover:text-primary"
                            >
                              {child.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center justify-between text-gray-800 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="px-6 py-4">
              <div
                onClick={() => toggleExpand("MY ACCOUNT")}
                className="flex cursor-pointer items-center justify-between text-sm font-bold uppercase tracking-wider text-gray-800 hover:text-primary"
              >
                MY ACCOUNT
                {toggleIcon(expandedItem, "MY ACCOUNT")}
              </div>
              <ul
                className={`mt-2 space-y-2 transition-all duration-300 ease-in-out ${
                  expandedItem === "MY ACCOUNT" ? "block" : "hidden"
                }`}
              >
                <li className="pl-4">
                  <div
                    onClick={() => toggleExpand("MANAGE PROFILE")}
                    className="flex cursor-pointer items-center justify-between py-2 text-sm text-gray-600 hover:text-primary"
                  >
                    Manage profile
                    {toggleIcon(expandedItem, "MANAGE PROFILE")}
                  </div>
                  <ul
                    className={`ml-4 space-y-2 transition-all duration-300 ease-in-out ${
                      expandedItem === "MANAGE PROFILE" ? "block" : "hidden"
                    }`}
                  >
                    <li>
                      <Link
                        href="/account/settings"
                        className="block py-2 text-xs text-gray-500 hover:text-primary"
                      >
                        Profile settings
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/account/change-password"
                        className="block py-2 text-xs text-gray-500 hover:text-primary"
                      >
                        Change password
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/account/addresses"
                        className="block py-2 text-xs text-gray-500 hover:text-primary"
                      >
                        Addresses
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/account/newsletters"
                        className="block py-2 text-xs text-gray-500 hover:text-primary"
                      >
                        Newsletters
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="pl-4">
                  <Link
                    href="/account/orders"
                    className="block py-2 text-sm text-gray-600 hover:text-primary"
                  >
                    Orders
                  </Link>
                </li>
                <li className="pl-4" onClick={handleSignOut}>
                  <div className="block py-2 text-sm text-gray-600 hover:text-primary">
                    Log out
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
});
