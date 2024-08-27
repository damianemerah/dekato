"use client";

import { useEffect } from "react";
import CartCard from "@/app/ui/cart/CartCard";
import { Button } from "@/app/ui/button";
import { inter } from "@/font";

export default function ConfirmCheckout() {
  return (
    <div className="mx-40 mt-7 flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1 shrink">
        <div className="rounded-sm bg-white px-5 py-4">
          <h2>Shipping Address</h2>
          <div className="flex__btw text-sm text-slate-500">
            <div>
              <div>
                <span className="mr-3 text-black">Emerah Damian</span>
                <span className="text-slate-900">+234 07066765698</span>
              </div>
              <div>4 Prince Obasi street Emene, Enugu</div>
              <div>Enugu East, Enugu state, Nigeria, 400103</div>
            </div>
            <div>
              <button className="text-blue-600">Change</button>
            </div>
          </div>
        </div>
        <div className="mt-2 rounded-sm bg-white px-5">
          <CartCard showIcon={false} />
          <CartCard showIcon={false} />
        </div>
      </div>
      <div className="shrink-0 basis-1/3">
        <div className="rounded-sm bg-white">
          <div className="px-5 py-4">
            <h2 className="mb-4">Summary</h2>
            <div
              className={`${inter.className} flex items-center justify-between`}
            >
              <p className="font-medium">Total</p>
              <p className="text-xl font-semibold">20 EUR</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Shipping</p>
              <p className="text-sm text-slate-900">Free</p>
            </div>
          </div>
          <Button className="block self-stretch bg-slate-900 text-center text-white">
            Checkout (0)
          </Button>
        </div>
        <div className="mt-2 rounded-sm bg-white px-5 py-4">More</div>
      </div>
    </div>
  );
}
