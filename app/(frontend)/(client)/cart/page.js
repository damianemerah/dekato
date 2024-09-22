"use client";

import { ButtonPrimary } from "@/app/ui/button";
import CartCards from "@/app/ui/cart/cart-card";
import { oswald } from "@/font";
import { useCartStore } from "@/store/store";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const cartIsLoading = useCartStore((state) => state.cartIsLoading);

  if (cartIsLoading) {
    return (
      <div className="flex h-full min-h-screen w-full items-center justify-center bg-black bg-opacity-10">
        <Spin
          indicator={
            <LoadingOutlined
              style={{ fontSize: 48 }}
              spin
              className="!text-primary"
            />
          }
          size="large"
        />
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-xl font-semibold text-gray-500">
          Your cart is empty
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <h1
        className={`${oswald.className} py-8 text-center text-5xl font-semibold uppercase tracking-wide text-gray-800 sm:text-3xl`}
      >
        Shopping Bag
      </h1>
      <div className="mt-4 flex flex-col gap-10 lg:flex-row lg:justify-center">
        <div className="lg:w-2/3">
          <p
            className={`${oswald.className} mb-4 text-lg font-medium uppercase text-grayText`}
          >
            # Items
          </p>
          <div className="flex flex-col items-center gap-4 px-2">
            <CartCards products={cart} />
          </div>
        </div>

        <div className="flex flex-col lg:w-1/3">
          <div className="flex flex-col gap-5">
            <div className="space-y-6 border border-grayOutline bg-grayBg p-5">
              <div className="space-y-2">
                <h3 className={`${oswald.className} text-2xl leading-5`}>
                  Estimate Shipping
                </h3>
                <p className="text-grayText">
                  Enter your destination to get a shipping estimate.
                </p>
              </div>
              <label className="flex justify-between gap-8" htmlFor="country">
                <span className="block text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                  Country
                </span>
                <select
                  disabled
                  name="country"
                  className="block w-full max-w-64 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                >
                  <option value="NG">Nigeria</option>
                </select>
              </label>
              <label className="flex justify-between gap-8" htmlFor="state">
                <span className="block text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                  State
                </span>
                <select
                  name="state"
                  className="block w-full max-w-64 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                >
                  <option value="AN">Anambra</option>
                </select>
              </label>
              <div className="flex flex-col gap-1">
                <h3 className={`${oswald.className} text-lg leading-5`}>DHL</h3>
                <label className="ml-1 inline-flex items-center">
                  <input
                    type="radio"
                    className="peer hidden"
                    name="shipping"
                    value="flat-rate"
                  />
                  <span className="inline-block h-2.5 w-2.5 border border-gray-400 outline outline-offset-1 peer-checked:border-transparent peer-checked:bg-black"></span>
                  <span className="ml-2 text-gray-700">Flat Rate NGN 3000</span>
                </label>
              </div>
            </div>
            <div className="relative border border-grayOutline bg-grayBg p-5">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>120 EUR</p>
              </div>
              <div className="mt-4 flex justify-between">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <div className="mt-4 flex justify-between">
                <p>Total</p>
                <p>120 EUR</p>
              </div>
            </div>
          </div>

          <ButtonPrimary className="mt-5 w-full">
            Proceed to Checkout
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
}
