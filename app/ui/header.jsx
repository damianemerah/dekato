"use client";
import { useSidebarStore } from "@/store/store";
import Link from "next/link";
import Logo from "./dekato-logo.jsx";
import SearchBox from "./searchbox.jsx";
import { oswald } from "@/style/font";
import { usePathname } from "next/navigation";
import useUserData from "@/app/hooks/useUserData.js";
import useCartData from "@/app/hooks/useCartData.js";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import {
  HeartOutlined,
  HeartFilled,
  ShoppingOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";

function Header() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { userData: user } = useUserData(userId);
  const { cartData: cart } = useCartData(userId);
  const [isShaking, setIsShaking] = useState(false);

  const toggleSidebarState = useSidebarStore((state) => state.toggleSidebar);
  const pathname = usePathname();
  const setLgScreenSidebar = useSidebarStore(
    (state) => state.setLgScreenSidebar,
  );
  const setMenuIsClicked = useSidebarStore((state) => state.setMenuIsClicked);

  useEffect(() => {
    if (cart?.totalItems === 0) return;
    const interval = setInterval(() => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [cart?.totalItems]);

  const handleSideBarToggle = () => {
    const isBelowThreshold = window.innerWidth < 1250;
    const currentIsSideBarOpen = useSidebarStore.getState().isSidebarOpen;

    if (!currentIsSideBarOpen && !isBelowThreshold) {
      setLgScreenSidebar(false);
    }
    if (currentIsSideBarOpen && !isBelowThreshold) {
      setLgScreenSidebar(true);
    }
  };

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`${oswald.className} sticky top-0 z-30 flex h-14 w-full items-center justify-between !bg-primary px-2 text-white sm:px-4 lg:px-10`}
      >
        <div className="flex h-full flex-1 items-center justify-start space-x-2 sm:space-x-4 lg:space-x-8">
          <div
            onClick={() => {
              toggleSidebarState();
              setMenuIsClicked(true);
              handleSideBarToggle();
            }}
            className="hover:bg-primary-dark rounded-full p-1 transition-colors duration-200 sm:p-2"
          >
            <MenuOutlined className="cursor-pointer !text-2xl" />
          </div>
          <div className="block sm:hidden">
            <SearchBox />
          </div>

          <nav className="hidden space-x-2 sm:flex sm:space-x-4">
            {["women", "men"].map((category) => (
              <Link key={category} href={`/${category}`}>
                <span
                  className={`text-sm font-bold uppercase tracking-widest transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white sm:text-sm ${
                    pathname.split("/")[1].toLowerCase() === category
                      ? "border-b-2 border-white"
                      : ""
                  }`}
                >
                  {category}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="mx-2 flex-none sm:mx-4 lg:mx-8">
          <Logo className="h-8 w-auto sm:h-10" />
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-3 md:space-x-6">
          <div className="hidden sm:block lg:mx-auto">
            <SearchBox />
          </div>
          {/* {user?.role === "admin" && (
          <Link href="/admin">
            <span className="flex items-center gap-2 text-sm uppercase transition-all duration-200 ease-in-out hover:border-b-2 hover:border-white sm:text-base">
              <CompassOutlined className=" stroke-2  text-sm" />
              <span className="hidden text-xs hover:border-b hover:border-white sm:text-sm md:inline">
                Admin Dashboard
              </span>
            </span>
          </Link>
        )} */}
          {user?.id ? (
            <Link href="/account" className="flex items-center gap-2">
              <UserOutlined className="stroke-2 md:text-xl" />
              <span className="hidden text-xs hover:border-b-2 hover:border-white sm:text-sm md:inline">
                {user?.firstname}
              </span>
            </Link>
          ) : (
            <Link
              href="/signin"
              className="flex items-center gap-2 transition-colors duration-200 hover:border-b-2 hover:border-white"
            >
              <UserOutlined className="stroke-2 md:text-xl" />
              <span className="hidden text-xs font-bold sm:text-sm md:inline">
                Login
              </span>
            </Link>
          )}

          <Link
            href="/account/wishlist"
            className="flex items-center gap-1.5 hover:border-b-2 hover:border-white"
          >
            {user?.wishlist?.length > 0 ? (
              <HeartFilled className="md:text-xl" />
            ) : (
              <HeartOutlined className="md:text-xl" />
            )}

            {user?.wishlist?.length > 0 && (
              <span className="text-sm font-bold text-white">
                {user.wishlist.length}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 hover:border-b-2 hover:border-white"
          >
            <ShoppingOutlined
              className={`md:text-xl ${isShaking ? "animate-shake" : ""}`}
            />
            {cart?.totalItems > 0 && (
              <span className="text-xs font-bold text-white">
                {cart.totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>
    </>
  );
}

export default Header;
