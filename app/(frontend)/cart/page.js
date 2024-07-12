"use client";

import Image from "next/image";
import heart from "@/public/assets/icons/heart.svg";
import edit from "@/public/assets/icons/edit.svg";
import del from "@/public/assets/icons/delete.svg";
import CartCards from "@/app/ui/cart/CartCard";
import { useEffect } from "react";
import { oswald, inter } from "@/font";
import { Button } from "@/app/ui/Button";
import frame77 from "@/public/assets/frame77-dark.svg";

export default function Cart() {
  return (
    <div
      className={`bg-gray-100 w-full h-full ${oswald.className} flex-1 flex px-40 mt-7 items-start justify-between gap-4 py-4`}
    >
      <div className="flex-1 min-w-0">
        <div className=" bg-white py-4 px-7 ">
          <h2 className="text-2xl font-bold mb-5">Shopping Cart (4)</h2>
          <div className={`flex items-center ${inter.className}`}>
            <label className="relative flex items-center">
              <span className="block w-5 h-5 border border-gray-400 rounded-full mr-2"></span>
              <input type="checkbox" className="absolute w-0 h-0" />
              <span className="pr-4">Select all items</span>
            </label>
            <button className="border-l border-l-gray-400 px-4 text-blue-600">
              Remove selected items
            </button>
          </div>
        </div>
        <div className="mt-2 bg-white  px-7 ">
          <CartCards />
        </div>
      </div>
      <div className="shrink-0 grow-0 basis-1/3 rounded-sm shadow-lg">
        <div className="bg-white rounded-sm">
          <div className="py-4 px-5">
            <h2 className="mb-4">Summary</h2>
            <div
              className={`${inter.className} flex items-center justify-between`}
            >
              <p className="font-medium">Total</p>
              <p className="font-semibold text-xl">20 EUR</p>
            </div>
          </div>
          <Button className="block text-white bg-black w-full text-center">
            Checkout (0)
          </Button>
        </div>
        <div className="bg-white py-4 px-5 mt-2 rounded-sm">
          <div>
            <Image
              src={frame77}
              width="100%"
              height="100%"
              alt="payment methods"
              className="block object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
