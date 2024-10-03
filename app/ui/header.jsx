"use client";
import { useSidebarStore, useUserStore, useCartStore } from "@/store/store";
import Link from "next/link";
import Logo from "./dekato-logo.jsx";
import SearchBox from "./searchbox.jsx";
import { oswald } from "@/font";
import UserIcon from "@/public/assets/icons/user.svg";
import HeartIcon from "@/public/assets/icons/heart.svg";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Space, Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { UserOutlined, LogoutOutlined, HeartOutlined } from "@ant-design/icons";
import { useEffect } from "react";

function Header() {
  const user = useUserStore((state) => state.user);
  const toggleSidebarState = useSidebarStore((state) => state.toggleSidebar);
  const pathname = usePathname();
  const cart = useCartStore((state) => state.cart);
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const items = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="/account"
          className="flex items-center"
        >
          <UserOutlined className="mr-2" /> {/* Icon for Account */}
          Account
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <button
          onClick={() => {
            toggleSidebarState();
            handleSignOut();
          }}
          className="flex w-full items-center text-left"
        >
          <LogoutOutlined className="mr-2" /> {/* Icon for Sign out */}
          Sign out
        </button>
      ),
    },
    {
      key: "3",
      label: (
        <Link href="/account/wishlist" className="flex items-center">
          <HeartOutlined className="mr-2" /> {/* Icon for Wishlist */}
          Wishlist
        </Link>
      ),
    },
  ];

  return (
    <header
      className={`${oswald.className} sticky top-0 z-[80] flex h-16 w-full items-center justify-between !bg-primary px-2 text-white sm:px-4 lg:px-10`}
    >
      <div className="flex h-full flex-1 items-center justify-start space-x-2 sm:space-x-4 lg:space-x-8">
        <button
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
        </button>
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

      <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
        {user ? (
          <Dropdown
            menu={{
              items,
            }}
            overlayStyle={{
              minWidth: "150px",
              borderRadius: 0,
              margin: "0 auto",
            }}
            style={{ borderRadius: 0 }}
          >
            <div className="text-center">
              <Space className="flex items-center">
                <UserIcon className="h-5 w-5 stroke-2 sm:h-6 sm:w-6" />
                <span className="hidden text-xs sm:inline sm:text-sm">
                  Hi, {user?.firstname}
                </span>
                <DownOutlined />
              </Space>
            </div>
          </Dropdown>
        ) : (
          <Link
            href="/signin"
            className="flex items-center space-x-1 transition-colors duration-200 hover:text-gray-300"
          >
            <UserIcon className="h-5 w-5 stroke-2 sm:h-6 sm:w-6" />
            <span className="hidden text-xs sm:inline sm:text-sm">Login</span>
          </Link>
        )}

        <Link
          href="/account/wishlist"
          className="hover:bg-primary-dark rounded-full p-1 transition-colors duration-200 sm:p-2"
        >
          <HeartIcon className="h-5 w-5 fill-white sm:h-6 sm:w-6" />
        </Link>
        <Link
          href="/cart"
          className="hover:bg-primary-dark relative rounded-full p-1 transition-colors duration-200 sm:p-2"
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
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {cart.totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white sm:h-5 sm:w-5">
              {cart.totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
