"use client";
import Image from "next/image";
import Link from "next/link";
import menu from "@/public/assets/icons/menu.svg";
import heart from "@/public/assets/icons/heart-white.svg";
import userIcon from "@/public/assets/icons/user.svg";
import localShip from "@/public/assets/icons/local_shipping.svg";
import cart from "@/public/assets/icons/cart.svg";
import logo from "@/public/assets/icons/dekato.png";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/store";
import logo from "@/public/assets/logo.png";
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
        className={`flex justify-between items-center px-12 py-3 text-white bg-slate-950 max-md:flex-wrap max-md:px-5`}
      >
        <div className="flex items-center justify-between gap-10 whitespace-nowrap py-1 text-sm font-medium uppercase">
          <Image
            // onClick={() => setShow(!show)}
            alt="cat"
            loading="lazy"
            width={100}
            height={100}
            src={menu}
            className="aspect-square w-8 shrink-0 cursor-pointer self-stretch"
          />
          <Link href="/">
            <Image
              alt="cat"
              width="100%"
              height="100%"
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
        <div className="relative flex flex-1 items-center mx-10 max-w-xl">
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
          <div className="flex flex-col items-center justify-center">
        <div className="flex gap-8 justify-center items-center text-xs tracking-normal whitespace-nowrap">
          <div className="flex flex-col items-center justify-center gap-1">
            <Image
              alt="cat"
              width="100%"
              height="100%"
              loading="lazy"
              src={userIcon}
              className="self-center"
            />
            {user && <p>Hi, {user.firstname}</p>}
            {!user && <Link href="/signin">LOGIN</Link>}
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Image
              alt="cat"
              width="100%"
              height="100%"
              loading="lazy"
              src={heart}
              className="self-center shadow-sm"
            />
            <p>Wishlist</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <Image
              width="100%"
              height="100%"
              alt="cat"
              loading="lazy"
              src={cart}
              className="self-center shadow-lg"
            />
            <div>cart</div>
          </div>
        </div>
      </header>
      <div className="flex justify-center self-center bg-white px-8 py-2 text-center text-black">
        <Image
          src={localShip}
          width="100%"
          height="100%"
          alt="icons"
          className="mr-2"
        />
        <p>FREE SHIPPING ON ORDERS ABOVE ₦150,000</p>
        <button
          className="p-4 bg-black text-white"
          onClick={async () => {
            await signOut({ callbackUrl: "/signin" });
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
