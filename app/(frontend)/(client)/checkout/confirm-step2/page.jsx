"use client";

import CheckoutProgress from "@/app/ui/checkout-progress";
import { ButtonPrimary } from "@/app/ui/button";
import OrderSummary from "@/app/ui/order-summary";
import { oswald } from "@/font";
import Link from "next/link";

export default function ConfirmCheckoutStep2() {
  return (
    <form>
      <CheckoutProgress step={2} />
      <div className="mx-auto flex max-w-5xl justify-center gap-16 pb-10">
        <div className="flex w-2/3 flex-col space-y-7">
          <div className="flex flex-col gap-2">
            <h2 className={`${oswald.className} text-2xl font-normal`}>
              Shipping Address
            </h2>
            <div className="flex gap-24">
              <p className="">
                Vyacheslav Kulbitski
                <br />
                Moskovski prospect 39/1, Apt. 147
                <br />
                Vitebsk, Vitebsk region 210038
                <br />
                Belarus
                <br />
                +375292169179
              </p>
              <button type="button" className="text-blue-500 hover:underline">
                Edit
              </button>
            </div>
          </div>

          {/* Billing and Shipping Address Checkbox */}
          <div className="flex flex-col gap-2">
            <h2 className={`${oswald.className} text-2xl font-normal`}>
              Billing Address
            </h2>
            <div className="flex gap-24">
              <p className="">
                Vyacheslav Kulbitski
                <br />
                Moskovski prospect 39/1, Apt. 147
                <br />
                Vitebsk, Vitebsk region 210038
                <br />
                Belarus
                <br />
                +375292169179
              </p>
              <button type="button" className="text-blue-500 hover:underline">
                Edit
              </button>
            </div>
          </div>

          {/* Shipping Method Summary */}
          <div className="flex flex-col gap-2">
            <h2 className={`${oswald.className} text-2xl font-normal`}>
              Shipping Method
            </h2>
            <p className="">
              Flat Rate - Fixed
              <br />
              NGN 3000 (DHL)
            </p>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-2">
            <h2 className={`${oswald.className} text-2xl font-normal`}>
              Payment Method
            </h2>
            <label className="flex items-center gap-3" htmlFor="card_payment">
              <input
                defaultChecked
                type="radio"
                id="card_payment"
                name="payment_method"
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              Pay with Card
            </label>
            <label className="flex items-center gap-3" htmlFor="bank_transfer">
              <input
                type="radio"
                id="bank_transfer"
                name="payment_method"
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              Pay with Bank Transfer
            </label>
          </div>

          {/* Place Order Button */}
          <ButtonPrimary className="w-fit">PLACE ORDER</ButtonPrimary>
        </div>

        {/* Order Summary */}
        <div className="w-1/3">
          <OrderSummary />
        </div>
      </div>
    </form>
  );
}
