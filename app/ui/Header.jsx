"use client";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "@/public/assets/icons/menu.svg";
import HeartIcon from "@/public/assets/icons/heart-white.svg";
import UserIcon from "@/public/assets/icons/user.svg";
import ShippingIcon from "@/public/assets/icons/local_shipping.svg";
import CartIcon from "@/public/assets/icons/cart.svg";
import logo from "@/public/assets/icons/dekato.png";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/store/store";
import { oswald } from "@/font";
// import { useAppContext } from "./AppContext";

function Header() {
  // const { setShow, show, headerRef } = useAppContext();
  const user = useUserStore((state) => state.user);

  return (
    <div>
      <header
        // ref={headerRef}
        className={`${oswald.className} flex items-center justify-between bg-slate-950 px-12 py-3 text-white max-md:flex-wrap max-md:px-5`}
      >
        <div className="flex items-center justify-between gap-10 whitespace-nowrap py-1 text-sm font-medium uppercase">
          <MenuIcon className="h-6 w-6" />
          <Link href="/">
            <Image
              alt="cat"
              loading="lazy"
              src={logo}
              className="my-auto aspect-[5] w-[101px] max-w-full shrink-0 self-stretch fill-white"
            />
          </Link>

          <ul className="flex gap-5">
            <li className="border-b-2 border-white p-1">Women</li>
            <li className="p-1">Men</li>
          </ul>
        </div>
        <div className="relative mx-10 flex flex-1 items-center">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full bg-white px-4 py-2 text-black outline-none"
          />
          <button type="button">
            <svg
              className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-black"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-5 whitespace-nowrap text-xs tracking-normal">
          <div className="flex flex-col items-center justify-center gap-1">
            <UserIcon className="h-5 w-5 self-center shadow-sm" />
            {user && <p>Hi, {user.firstname}</p>}
            {!user && <Link href="/signin">Login</Link>}
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <HeartIcon className="h-5 w-5 self-center shadow-sm" />
            <p>Wishlist</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <CartIcon className="h-5 w-5 self-center shadow-sm" />
            <div>Cart</div>
          </div>
        </div>
      </header>
      <div className="flex items-center justify-center gap-3 bg-white px-8 py-2 text-center text-black">
        <ShippingIcon className="text-2xl" />
        <p>FREE SHIPPING ON ORDERS ABOVE ₦150,000</p>
        <button
          className="bg-black p-4 text-white"
          onClick={async () => {
            await signOut();
            toast.success("You have signed out successfully");
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default Header;
