"use client";

import Image from "next/image";
import heart from "@/public/assets/icons/heart.svg";
import edit from "@/public/assets/icons/edit.svg";
import del from "@/public/assets/icons/delete.svg";
import CartCard from "@/components/CartCard";
import { useEffect } from "react";
import { oswald, inter } from "@/font";
import Button from "@/components/Button";
import frame77 from "@/public/assets/frame77-dark.svg";

export default function Cart() {
  useEffect(() => {
    document.body.classList.add("bg-gray-100");
  }, []);

  return (
    <div
      className={`${oswald.className} flex mx-40 mt-7 items-start justify-center gap-4`}
    >
      <div className="grow-0 shrink-0 basis-2/3">
        <div className="bg-white py-4 px-7 rounded-sm">
          <h2 className="text-2xl font-bold mb-5">Shopping Cart (4)</h2>
          <div className={`flex items-center ${inter.className}`}>
            <label className="relative flex items-center">
              <span className="block w-5 h-5 border border-gray-400 rounded-full mr-2"></span>
              <input type="checkbox" className="absolute w-0 h-0" />
              <span className="pr-4">Select all items</span>
            </label>
            <div className="border-l border-l-gray-400 px-4 text-blue-600">
              Remove selected items
            </div>
          </div>
        </div>
        <div className="mt-2 bg-white rounded-sm px-7">
          <CartCard heart={heart} edit={edit} del={del} />
          <CartCard heart={heart} edit={edit} del={del} />
        </div>
      </div>
      <div className="flex-1">
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
          <Button className="block text-white bg-black self-stretch text-center">
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
