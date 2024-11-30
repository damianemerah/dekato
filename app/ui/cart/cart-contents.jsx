"use client";

import { ButtonPrimary } from "@/app/ui/button";
import CartCards from "@/app/ui/cart/cart-card";
import { oswald } from "@/style/font";
import Link from "next/link";
import ArrowLeft from "@/public/assets/icons/arrow_left.svg";
import ArrowRight from "@/public/assets/icons/arrow_right.svg";
import Paystack from "@/public/assets/icons/paystack.svg";
import WhatsappIcon from "@/public/assets/icons/whatsapp.svg";
import { SmallSpinner } from "@/app/ui/spinner";
import { useSession } from "next-auth/react";
import useCartData from "@/app/hooks/useCartData";
import { formatToNaira } from "@/utils/getFunc";

export default function Cart() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    cartData: cart,
    isLoading: cartIsLoading,
    error: cartError,
  } = useCartData(userId);

  if (cartIsLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <SmallSpinner className="!text-primary" />
        <p>Loading...</p>
      </div>
    );
  }

  if (cart?.item?.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Your cart is empty</p>
      </div>
    );
  }

  if (cartError) {
    console.log(cartError);
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Error loading cart</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-grayBg">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <CartHeader />
        <div className="my-8 flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="md:w-2/3">
            <CartCards products={cart?.item} />
          </div>
          <div className="lg:w-1/3">
            <ProceedToCheckoutBox
              totalPrice={cart?.totalPrice}
              amountSaved={cart?.amountSaved}
            />
            <PaystackSecured />
          </div>
        </div>
        <ContinueShoppingLink />
      </div>
    </div>
  );
}

function CartHeader() {
  return (
    <header className="flex items-center justify-between">
      <ContinueShoppingLink />
      <h1
        className={`${oswald.className} mx-auto text-center text-2xl font-medium uppercase text-primary`}
      >
        Shopping Bag
      </h1>
    </header>
  );
}

function ContinueShoppingLink() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 transition-colors duration-200 hover:text-primary"
    >
      <ArrowLeft className="text-gray-800" />
      <span className="text-sm">Continue Shopping</span>
    </Link>
  );
}

function PaystackSecured() {
  return (
    <div className="mt-4 flex items-center justify-center gap-2 bg-white p-4 shadow-sm">
      <p className="text-xs italic text-gray-600">Secured by</p>
      <Paystack width={123.48} height={22} />
    </div>
  );
}

function ProceedToCheckoutBox({ totalPrice, amountSaved }) {
  return (
    <div className="bg-white px-6 py-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b pb-4 font-semibold text-primary">
        <p>Subtotal</p>
        <p className="text-right">{formatToNaira(totalPrice)}</p>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-primary">Shipping</span>
        <span className="font-medium">TBD</span>
      </div>

      <div className="mb-6 border-t pt-4">
        <div className="flex items-center justify-between font-semibold text-primary">
          <span>Total</span>
          <span className="text-right">{formatToNaira(totalPrice)}</span>
        </div>
        {amountSaved > 0 && (
          <p className="mt-2 text-sm text-slate-500">
            You save {formatToNaira(amountSaved)} with this order
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
