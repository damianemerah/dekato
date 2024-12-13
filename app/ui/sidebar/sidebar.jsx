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

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <aside
        className={`${
          isSidebarOpen
            ? "visible min-w-[280px] translate-x-0 shadow-xl"
            : "invisible w-0 -translate-x-full"
        } ${
          !lgScreenSidebar && !isBelowThreshold && "hidden"
        } relative z-50 h-full flex-shrink-0 bg-white text-primary transition-all duration-300 ease-in-out`}
        aria-label="Sidebar navigation"
      >
        <nav className="h-full overflow-y-auto">
          <ul className={`${oswald.className} divide-y divide-gray-100`}>
            {categories?.map((category) => (
              <li
                key={category.id}
                className="group p-4 transition-colors hover:bg-gray-50"
              >
                <div
                  onClick={() => toggleExpand(category.name)}
                  className="flex cursor-pointer items-center justify-between text-sm font-bold uppercase tracking-wider text-gray-800 transition-colors group-hover:text-primary md:text-base"
                  role="button"
                  aria-expanded={expandedItem === category.name}
                  aria-controls={`submenu-${category.name}`}
                >
                  {category.name}
                  {toggleIcon(expandedItem, category.name)}
                </div>
                <ul
                  id={`submenu-${category.name}`}
                  className={`mt-3 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedItem === category.name
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {category.children?.map((child) => (
                    <li key={child.id} className="group/child p-2">
                      <Link
                        href={`/${category.slug}/${child.slug}`}
                        className="block text-sm text-gray-600 transition-colors hover:text-primary md:text-base"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {user?.id && (
              <li className="group p-4 transition-colors hover:bg-gray-50">
                <div
                  onClick={() => toggleExpand("MY ACCOUNT")}
                  className="flex cursor-pointer items-center justify-between text-sm font-bold uppercase tracking-wider text-gray-800 transition-colors group-hover:text-primary md:text-base"
                  role="button"
                  aria-expanded={expandedItem === "MY ACCOUNT"}
                  aria-controls="account-submenu"
                >
                  MY ACCOUNT
                  {toggleIcon(expandedItem, "MY ACCOUNT")}
                </div>
                <ul
                  id="account-submenu"
                  className={`mt-3 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedItem === "MY ACCOUNT"
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {accountLinks.map(({ href, label }) => (
                    <li key={href} className="group/account p-2">
                      <Link
                        href={href}
                        className={`block text-sm text-gray-600 transition-colors group-hover/account:text-primary md:text-base ${
                          pathname === href ? "font-semibold text-primary" : ""
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                  <li className="group/logout p-2">
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left text-sm text-gray-600 transition-colors group-hover/logout:text-primary md:text-base"
                    >
                      Log out
                    </button>
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
