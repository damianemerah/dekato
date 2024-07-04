"use client";

import { useEffect } from "react";
import CartCard from "@/components/CartCard";
import { Button } from "@/components/Button";
import { inter } from "@/font";

export default function ConfirmCheckout() {
  useEffect(() => {
    document.body.classList.add("bg-gray-100");
  }, []);

  return (
    <div className="flex mx-40 mt-7 items-start justify-between gap-4 ">
      <div className="flex-1 shrink min-w-0">
        <div className="px-5 py-4 bg-white rounded-sm">
          <h2>Shipping Address</h2>
          <div className="text-sm text-slate-500 flex__btw">
            <div>
              <div>
                <span className="text-black mr-3">Emerah Damian</span>
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
        <div className="px-5 bg-white rounded-sm mt-2">
          <CartCard showIcon={false} />
          <CartCard showIcon={false} />
        </div>
      </div>
      <div className="shrink-0 basis-1/3">
        <div className="bg-white rounded-sm">
          <div className="py-4 px-5">
            <h2 className="mb-4">Summary</h2>
            <div
              className={`${inter.className} flex items-center justify-between`}
            >
              <p className="font-medium">Total</p>
              <p className="font-semibold text-xl">20 EUR</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Shipping</p>
              <p className="text-sm text-slate-900">Free</p>
            </div>
          </div>
          <Button className="block text-white bg-slate-900 self-stretch text-center">
            Checkout (0)
          </Button>
        </div>
        <div className="bg-white py-4 px-5 mt-2 rounded-sm">More</div>
      </div>
    </div>
  );
}
