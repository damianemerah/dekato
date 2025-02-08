"use client";
import React, { useEffect, useState, memo } from "react";
import { useSidebarStore, useUserStore } from "@/store/store";
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

const UpperFirstLetter = (str) => {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
};

export default memo(function Sidebar({ categories, collections }) {
  const {
    isSidebarOpen,
    closeSidebar,
    openSidebar,
    lgScreenSidebar,
    setLgScreenSidebar,
    setMenuIsClicked,
    setIsMobile,
  } = useSidebarStore();

  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  const pathname = usePathname();
  const isBelowThreshold = useIsBelowThreshold();
  const [expandedItem, setExpandedItem] = useState(null);

  // Handle window resize
  useEffect(() => {
    function handleResize() {
      setIsMobile(isBelowThreshold);
      if (isBelowThreshold && !useSidebarStore.getState().menuIsClicked) {
        closeSidebar();
      }
      if (
        !isBelowThreshold &&
        lgScreenSidebar &&
        !pathname.startsWith("/cart")
      ) {
        openSidebar();
      }
      if (!isBelowThreshold) setMenuIsClicked(false);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [
    closeSidebar,
    openSidebar,
    lgScreenSidebar,
    setMenuIsClicked,
    pathname,
    isBelowThreshold,
    setIsMobile,
  ]);

  // Handle restricted paths
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

  const handleSignOut = async () => {
    await mutate(`/api/user/${user?.id}`, null);
    await signOut({ callbackUrl: "/" });
    setUser(null);
  };

  const toggleExpand = (label) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

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

  // Process categories into sidebar items
  const sidebarItems = [
    {
      label: "NEW ARRIVALS",
      children: collections
        ?.filter((items) => items.slug.startsWith("new-arrival"))
        .map((collection) => ({
          label: categories.find((cat) => cat.id === collection.category).name,
          href: `/shop/${collection.path[0]}`,
        })),
    },
    ...(categories
      ?.filter((cat) => !cat.parent)
      .map((topCat) => ({
        label: topCat.name.toUpperCase(),
        href: `/shop/${topCat.path[0]}`,
        children: topCat?.children.map((subCat) => ({
          label: subCat.name,
          href: `/shop/${subCat.path[0]}`,
        })),
      })) || []),
    {
      label: "COLLECTIONS",
      children: collections
        ?.filter((item) => !item.slug.startsWith("new-arrival"))
        .map((collection) => ({
          label: collection.name,
          href: `/shop/${collection.path[0]}`,
        })),
    },
  ];

  if (pathname.startsWith("/admin")) return null;

  return (
    <aside
      className={`${
        isSidebarOpen
          ? "visible min-w-[280px] translate-x-0 ring-1 ring-primary/10"
          : "invisible w-0 -translate-x-full"
      } ${!lgScreenSidebar && !isBelowThreshold && "hidden"} relative z-50 h-full flex-shrink-0 bg-white text-primary transition-all duration-300 ease-in-out`}
    >
      <nav className="h-full overflow-y-auto">
        <ul className={`divide-y divide-gray-200 font-oswald`}>
          {sidebarItems?.map((item, index) => (
            <li key={index} className="p-4">
              {item.children?.length ? (
                <>
                  <div
                    onClick={() => toggleExpand(item.label)}
                    className={`flex cursor-pointer items-center justify-between text-base font-bold uppercase tracking-wider ${item.label.toLowerCase().includes("new arrival") ? "text-red-600 hover:text-red-600/75" : "text-primaryDark hover:text-primaryDark/75"}`}
                  >
                    {item.label}
                    {toggleIcon(expandedItem, item.label)}
                  </div>
                  <ul
                    className={`mt-3 overflow-hidden transition-all duration-300 ease-in-out ${
                      expandedItem === item.label
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex} className="px-2 py-1">
                        <Link
                          href={child.href || "#"}
                          className={`block text-sm font-bold tracking-wide ${pathname === child.href ? "text-primary" : "text-primaryDark/65 hover:text-primary"}`}
                        >
                          {UpperFirstLetter(child.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={`cursor-pointer text-sm font-bold uppercase tracking-wider ${pathname === item.href ? "text-primary" : "text-primaryDark hover:text-primaryDark/75"}`}
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
                className="flex cursor-pointer items-center justify-between text-sm font-bold uppercase tracking-wider text-primaryDark hover:text-primaryDark/75"
              >
                MY ACCOUNT
                {toggleIcon(expandedItem, "MY ACCOUNT")}
              </div>
              <ul
                className={`mt-3 overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedItem === "MY ACCOUNT"
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {accountLinks.map(({ href, label }) => (
                  <li key={href} className="p-2 font-bold tracking-wide">
                    <Link
                      href={href}
                      className={`block text-sm ${pathname === href ? "text-primary" : "text-primaryDark/65 hover:text-primary"}`}
                    >
                      {UpperFirstLetter(label)}
                    </Link>
                  </li>
                ))}
                <li
                  className="p-2 font-bold tracking-wide"
                  onClick={handleSignOut}
                >
                  <div className="block cursor-pointer text-sm text-red-600 hover:text-red-600/75">
                    Log out
                  </div>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
});
