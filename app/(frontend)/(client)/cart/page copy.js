"use client";

import heart from "@/public/assets/icons/heart.svg";
import edit from "@/public/assets/icons/edit.svg";
import del from "@/public/assets/icons/delete.svg";
import CartCards from "@/app/ui/cart/cart-card";
import { oswald, inter } from "@/font";
import { Button } from "@/app/ui/button";
import Frame77 from "@/public/assets/frame77-dark.svg";
import { Frame } from "@shopify/polaris";

export default function Cart() {
  return (
    <div
      className={`h-full w-full bg-gray-100 ${oswald.className} mt-7 flex flex-1 items-start justify-between gap-4 px-40 py-4`}
    >
      <div className="min-w-0 flex-1">
        <div className="bg-white px-7 py-4">
          <h2 className="mb-5 text-2xl font-bold">Shopping Cart (4)</h2>
          <div className={`flex items-center ${inter.className}`}>
            <label className="relative flex items-center">
              <span className="mr-2 block h-5 w-5 rounded-full border border-gray-400"></span>
              <input type="checkbox" className="absolute h-0 w-0" />
              <span className="pr-4">Select all items</span>
            </label>
            <button className="border-l border-l-gray-400 px-4 text-blue-600">
              Remove selected items
            </button>
          </div>
        </div>
        <div className="mt-2 bg-white px-7">
          <CartCards />
        </div>
      </div>
      <div className="shrink-0 grow-0 basis-1/3 rounded-sm shadow-lg">
        <div className="rounded-sm bg-white">
          <div className="px-5 py-4">
            <h2 className="mb-4">Summary</h2>
            <div
              className={`${inter.className} flex items-center justify-between`}
            >
              <p className="font-medium">Total</p>
              <p className="text-xl font-semibold">20 EUR</p>
            </div>
          </div>
          <Button className="block w-full bg-black text-center text-white">
            Checkout (0)
          </Button>
        </div>
        <div className="mt-2 rounded-sm bg-white px-5 py-4">
          <div>
            <Frame77 />
          </div>
        </div>
      </div>
    </div>
  );
}
