"use client";
import React, { useEffect, useState, memo, useCallback, useMemo } from "react";
import { useSidebarStore, useUserStore } from "@/store/store";
import { oswald } from "@/style/font";
import { usePathname } from "next/navigation";
import Link from "next/link";
import useIsBelowThreshold from "@/app/hooks/useIsBelowThreshold";
import { signOut } from "next-auth/react";
import { mutate } from "swr";

const accountLinks = [
  { href: "/account", label: "Account Dashboard" },
  { href: "/account/orders", label: "My Orders" },
  { href: "/account/wishlist", label: "My Wishlist" },
  { href: "/account/address", label: "Address Book" },
  { href: "/account/payment", label: "Payment Method" },
  { href: "/account/newsletter", label: "Newsletter" },
];

export default memo(function Sidebar({ categories, collections }) {
  const {
    isSidebarOpen,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    lgScreenSidebar,
    setLgScreenSidebar,
    setMenuIsClicked,
    setIsMobile,
    isMobile,
  } = useSidebarStore();

  const { user, setUser } = useUserStore(
    useCallback(
      (state) => ({
        user: state.user,
        setUser: state.setUser,
      }),
      [],
    ),
  );
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
    if (!isBelowThreshold) setMenuIsClicked(false);
  }, [
    closeSidebar,
    openSidebar,
    lgScreenSidebar,
    setMenuIsClicked,
    pathname,
    isBelowThreshold,
    setIsMobile,
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
    await mutate(`/api/user/${user?.id}`, null);
    await signOut({ callbackUrl: "/" });
    setUser(null);
  }, [setUser, user?.id]);

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

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        ></div>
      )} */}
      <aside
        className={`${
          isSidebarOpen
            ? "visible min-w-[250px] translate-x-0"
            : "invisible w-0 -translate-x-full"
        } ${!lgScreenSidebar && !isBelowThreshold && "hidden"} relative z-50 h-full flex-shrink-0 bg-white text-primary transition-all duration-300 ease-in-out`}
      >
        <nav className="h-full overflow-y-auto">
          <ul className={`${oswald.className} divide-y divide-gray-200`}>
            {sidebarItems?.map((item, index) => (
              <li key={index} className="p-4">
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
                      className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedItem === item.label
                          ? "max-h-[1000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex} className="p-2">
                          {child.children && child.children.length > 0 ? (
                            <>
                              <div
                                onClick={() => toggleExpand(child.label)}
                                className="flex cursor-pointer items-center justify-between text-sm text-gray-600 hover:text-primary"
                              >
                                {child.label}
                                {toggleIcon(expandedItem, child.label)}
                              </div>
                              <ul
                                className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                                  expandedItem === child.label
                                    ? "max-h-[500px] opacity-100"
                                    : "max-h-0 opacity-0"
                                }`}
                              >
                                {child.children.map(
                                  (grandChild, grandChildIndex) => (
                                    <li
                                      key={grandChildIndex}
                                      className="p-2 text-xs"
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
                              className="block text-sm text-gray-600 hover:text-primary"
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
            {user?.id && (
              <li className="p-4">
                <div
                  onClick={() => toggleExpand("MY ACCOUNT")}
                  className="flex cursor-pointer items-center justify-between text-sm font-bold uppercase tracking-wider text-gray-800 hover:text-primary"
                >
                  MY ACCOUNT
                  {toggleIcon(expandedItem, "MY ACCOUNT")}
                </div>
                <ul
                  className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedItem === "MY ACCOUNT"
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {accountLinks.map(({ href, label }) => (
                    <li key={href} className="p-2">
                      <Link
                        href={href}
                        className={`block text-sm text-gray-600 hover:text-primary ${
                          pathname === href ? "font-semibold" : ""
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                  <li className="p-2" onClick={handleSignOut}>
                    <div className="block cursor-pointer text-sm text-gray-600 hover:text-primary">
                      Log out
                    </div>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
});
