"use client";

import { ButtonPrimary } from "@/app/ui/button";
import CartCards from "@/app/ui/cart/cart-card";
import { oswald } from "@/font";
import { useCartStore } from "@/store/store";
import Link from "next/link";
import ArrowLeft from "@/public/assets/icons/arrow_left.svg";
import ArrowRight from "@/public/assets/icons/arrow_right.svg";
import Paystack from "@/public/assets/icons/paystack.svg";
import WhatsappIcon from "@/public/assets/icons/whatsapp.svg";
import { BigSpinner } from "@/app/ui/spinner";

export default function Cart() {
  const cart = useCartStore((state) => state.cart);
  const cartIsLoading = useCartStore((state) => state.cartIsLoading);

  console.log(cart, "🔥🔥🔥cart");

  if (cartIsLoading) {
    return <BigSpinner />;
  }

  return (
    <div className="min-h-screen bg-grayBg">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        {cart.item && cart.item.length > 0 ? (
          <header className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 transition-colors duration-200 hover:text-primary"
            >
              <ArrowLeft className="text-gray-800" />
              <span className="text-sm">Continue Shopping</span>
            </Link>
            <h1
              className={`${oswald.className} mx-auto text-center text-2xl font-medium uppercase text-primary`}
            >
              Shopping Bag
            </h1>
            {/* <Link href="/checkout">
              <ButtonPrimary className="flex items-center justify-center text-sm font-bold normal-case tracking-wide transition-all duration-200 hover:bg-opacity-90">
                <span>Proceed to checkout</span>
                <ArrowRight className="ml-2 text-white" />
              </ButtonPrimary>
            </Link> */}
          </header>
        ) : (
          <h1
            className={`${oswald.className} text-center text-2xl font-medium uppercase text-primary`}
          >
            Shopping Bag
          </h1>
        )}

        {/* Main Content */}
        {cart.item && cart.item.length > 0 ? (
          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:justify-between">
            {/* Left Side: Cart Items */}
            <div className="lg:w-2/3">
              {/* Product List */}
              <CartCards products={cart.item} />
            </div>
            {/* Right Side: Order Summary */}
            <div className="self-start lg:w-1/3">
              <ProceedToCheckoutBox
                totalPrice={cart.totalPrice}
                amountSaved={cart.amountSaved}
              />

              <div className="mt-4 flex items-center justify-center gap-2 bg-white p-4 shadow-sm">
                <p className="text-xs italic text-gray-600">Secured by</p>
                <Paystack width={123.48} height={22} />
              </div>
            </div>
          </div>
        ) : (
          <div className="my-12 flex h-[50vh] items-center justify-center bg-white shadow-sm">
            <p className="text-xl font-semibold text-grayText">
              Your cart is empty
            </p>
          </div>
        )}
        <Link
          href="/"
          className="mt-6 flex items-center gap-2 transition-colors duration-200 hover:text-primary"
        >
          <ArrowLeft className="text-gray-800" />
          <span className="text-sm">Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
}

function ProceedToCheckoutBox({ totalPrice, amountSaved }) {
  return (
    <div className="bg-white px-6 py-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b pb-4 font-semibold text-primary">
        <p>Subtotal</p>
        <p className="text-right">₦{totalPrice}</p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-primary">Shipping</span>
        <span className="font-medium text-green-600">TBD</span>
      </div>

      <div className="mb-6 border-t pt-4">
        <div className="flex items-center justify-between font-semibold text-primary">
          <span>Total</span>
          <span className="text-right">₦{totalPrice}</span>
        </div>
        {amountSaved > 0 && (
          <p className="mt-2 text-sm text-slate-500">
            You save ₦{amountSaved.toLocaleString()} with this order
          </p>
        )}
      </div>

      <Link href="/checkout">
        <ButtonPrimary className="flex w-full items-center justify-center !bg-secondary text-sm font-bold normal-case tracking-wide transition-all duration-200 hover:bg-opacity-90">
          <span>Proceed to checkout</span>
          <ArrowRight className="ml-2 text-white" />
        </ButtonPrimary>
      </Link>
      <ButtonPrimary className="mt-4 flex w-full items-center justify-center bg-[#25D366] text-sm font-bold normal-case tracking-wide transition-all duration-200 hover:bg-opacity-90">
        Whatsapp checkout
        <WhatsappIcon className="ml-2.5 h-6 w-6 fill-green-500 text-white" />
      </ButtonPrimary>
    </div>
  );
}
