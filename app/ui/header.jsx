"use client";
import { useSidebarStore } from "@/store/store";
import Link from "next/link";
import Logo from "./dekato-logo.jsx";
import SearchBox from "./searchbox.jsx";
import { oswald } from "@/style/font";
import UserIcon from "@/public/assets/icons/user.svg";
import { usePathname } from "next/navigation";
import useUserData from "@/app/hooks/useUserData.js";
import useCartData from "@/app/hooks/useCartData.js";
import { useSession } from "next-auth/react";
import { HeartOutlined, ShoppingOutlined } from "@ant-design/icons";

function Header() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { userData: user } = useUserData(userId);
  const { cartData: cart } = useCartData(userId);

  const toggleSidebarState = useSidebarStore((state) => state.toggleSidebar);
  const pathname = usePathname();
  const setLgScreenSidebar = useSidebarStore(
    (state) => state.setLgScreenSidebar,
  );
  const setMenuIsClicked = useSidebarStore((state) => state.setMenuIsClicked);

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

  return (
    <header
      className={`${oswald.className} sticky top-0 z-[80] flex h-16 w-full items-center justify-between !bg-primary px-2 text-white sm:px-4 lg:px-10`}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        <nav className="hidden space-x-2 sm:flex sm:space-x-4">
          {["women", "men"].map((category) => (
            <Link key={category} href={`/${category}`}>
              <span
                className={`text-sm uppercase transition-all duration-200 ease-in-out hover:text-gray-300 sm:text-base ${
                  pathname.split("/")[1].toLowerCase() === category
                    ? "border-b-2 border-white pb-1"
                    : ""
                }`}
              >
                {category}
              </span>
            </Link>
          ))}
        </nav>
        <SearchBox />
      </div>

      <Link href="/" className="mx-2 flex-none sm:mx-4 lg:mx-8">
        <Logo className="h-8 w-auto sm:h-10" />
      </Link>

      <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-6">
        {user?.id ? (
          <Link href="/account" className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 stroke-2 sm:h-6 sm:w-6" />
            <span className="hidden text-xs hover:border-b hover:border-b-white sm:inline sm:text-sm">
              Hi, {user?.firstname || user?.email}
            </span>
          </Link>
        ) : (
          <Link
            href="/signin"
            className="flex items-center space-x-1 transition-colors duration-200"
          >
            <UserIcon className="h-5 w-5 stroke-2 sm:h-6 sm:w-6" />
            <span className="hidden text-xs hover:border-b hover:border-b-white sm:inline sm:text-sm">
              Login
            </span>
          </Link>
        )}

        <Link href="/account/wishlist" className="flex items-center gap-1.5">
          <HeartOutlined className="text-xl" />

          {user?.wishlist?.length > 0 && (
            <span className="text-sm font-bold text-white">
              {user.wishlist.length}
            </span>
          )}
        </Link>
        <Link href="/cart" className="flex items-center gap-1.5">
          <ShoppingOutlined className="text-xl" />
          {cart.totalItems > 0 && (
            <span className="text-sm font-bold text-white">
              {cart.totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
