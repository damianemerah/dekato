"use client";
import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { useSidebarStore, useUserStore } from "@/store/store";
import { oswald } from "@/style/font";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useIsBelowThreshold from "@/app/hooks/useIsBelowThreshold";
import { signOut } from "next-auth/react";

export default memo(function Sidebar({ categories, collections }) {
  const {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    lgScreenSidebar,
    setLgScreenSidebar,
    setMenuIsClicked,
  } = useSidebarStore();

  const setUser = useUserStore((state) => state.setUser);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isBelowThreshold = useIsBelowThreshold();
  const [expandedItem, setExpandedItem] = useState(null);

  const handleResize = useCallback(() => {
    setIsMobile(isBelowThreshold);

    if (isBelowThreshold && !useSidebarStore.getState().menuIsClicked) {
      closeSidebar();
    }
    if (!isBelowThreshold && lgScreenSidebar && !pathname.startsWith("/cart")) {
      openSidebar();
    }
    setMenuIsClicked(false);
  }, [
    closeSidebar,
    openSidebar,
    lgScreenSidebar,
    setMenuIsClicked,
    pathname,
    isBelowThreshold,
  ]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  useEffect(() => {
    const restrictedPaths = [
      "/cart",
      "/checkout",
      "/signin",
      "/signup",
      "/forgot-password",
    ];
    if (restrictedPaths.some((path) => pathname.startsWith(path))) {
      closeSidebar();
      setLgScreenSidebar(false);
    }
  }, [pathname, closeSidebar, setLgScreenSidebar]);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
    setUser(null);
  }, [setUser]);

  const toggleExpand = useCallback((label) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  }, []);

  const toggleIcon = (expandedItem, toggleItem) => (
    <span className="relative flex h-6 w-6 items-center justify-center">
      <span className="h-0.5 w-3 bg-primary transition-transform duration-300" />
      <span
        className={`absolute h-0.5 w-3 bg-primary transition-transform duration-300 ${
          expandedItem === toggleItem ? "rotate-0" : "rotate-90"
        }`}
      />
    </span>
  );

  const mapCategories = useMemo(() => {
    const topLevelCategories = categories?.filter((cat) => !cat.parent) || [];

    const removeParentPrefix = (name, parentName) => {
      const lowerName = name.toLowerCase();
      const lowerParentName = parentName.toLowerCase();

      if (lowerName.startsWith(`${lowerParentName}'s`)) {
        const remainder = name.slice(parentName.length + 2).trim();
        return remainder.length > 0 ? remainder : name;
      }

      if (lowerName.startsWith(lowerParentName)) {
        const remainder = name.slice(parentName.length).trim();
        return remainder.length > 0 ? remainder : name;
      }

      return name;
    };

    return topLevelCategories.map((topCat) => ({
      label: topCat.name.toUpperCase(),
      href: `/${topCat.path[topCat.path.length - 1]}`,
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
                  href: `/${topCat.path[topCat.path.length - 1]}/${subCat.slug}/${childCat.slug}`,
                };
              }),
          };
        }),
    }));
  }, [categories]);

  const sidebarItems = useMemo(
    () => [
      ...mapCategories,
      {
        label: "COLLECTIONS",
        children: collections?.map((collection) => ({
          label: collection.name,
          href: `/${collection.slug}`,
        })),
      },
    ],
    [mapCategories, collections],
  );

  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
    return null;
  }

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={toggleSidebar}
        ></div>
      )}
      <aside
        className={`${
          isSidebarOpen
            ? "visible min-w-[250px] translate-x-0"
            : "invisible w-0 -translate-x-full"
        } ${!lgScreenSidebar && !isBelowThreshold && "hidden"} relative z-50 h-full flex-shrink-0 bg-white text-primary shadow-lg transition-all duration-300 ease-in-out`}
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
                                        href={grandChild.href || "#"}
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
                              href={child.href || "#"}
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
                    href={item.href || "#"}
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
