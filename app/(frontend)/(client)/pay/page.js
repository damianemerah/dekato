"use client";

import CheckoutProgress from "@/app/ui/checkout-progress";
import { ButtonPrimary } from "@/app/ui/button";
import OrderSummary from "@/app/ui/order-summary";

import { useRouter } from "next/navigation";

import { oswald } from "@/font";
import Link from "next/link";

export default function ConfirmCheckout() {
  const router = useRouter();

  const handleNextStep = () => {
    // Perform any validation or actions required
    router.push("/pay/confirm-step2"); // Navigate to the next step
  };
  return (
    <form>
      <CheckoutProgress />
      <div className="mx-auto flex max-w-6xl justify-center gap-16 pb-10">
        <div className="flex flex-col space-y-7">
          <div className="flex flex-col gap-2">
            <h2 className={`${oswald.className} text-2xl font-normal`}>
              Shipping Address
            </h2>
            <p>
              You already have an account with us.{" "}
              <Link href="/account" className="text-blue-500">
                Sign in
              </Link>{" "}
              or continue as guest.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4">
            <label
              className="flex w-full justify-between gap-8"
              htmlFor="firstname"
            >
              <span className="block shrink-0 text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                First name
              </span>
              <input
                type="text"
                name="firstname"
                className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
              />
            </label>
            <label
              className="flex w-full justify-between gap-8"
              htmlFor="lastname"
            >
              <span className="block shrink-0 text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                Last name
              </span>
              <input
                type="text"
                name="lastname"
                className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
              />
            </label>
            <label
              className="flex w-full justify-between gap-8"
              htmlFor="street_address"
            >
              <span className="block shrink-0 text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                Street address
              </span>
              <input
                type="text"
                name="street_address"
                className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
              />
            </label>
            <label
              className="flex w-full justify-between gap-8"
              htmlFor="apartment_suite"
            >
              <span className="block shrink-0 text-sm font-medium text-slate-700">
                Apartment/Suite
              </span>
              <input
                type="text"
                name="apartment_suite"
                className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
              />
            </label>
            <label
              className="flex w-full justify-between gap-8"
              htmlFor="country"
            >
              <span className="block text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                Country
              </span>
              <select
                disabled
                name="country"
                className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-gray-100 disabled:text-grayText sm:text-sm"
              >
                <option value="NG">Nigeria</option>
              </select>
            </label>
            <label
              className="flex w-full justify-between gap-8"
              htmlFor="state"
            >
              <span className="block text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                State
              </span>
              <select
                name="state"
                className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:bg-gray-100 disabled:text-grayText sm:text-sm"
              >
                <option value="NG">Abia</option>
                <option value="NG">Adamawa</option>
              </select>
            </label>
            <label
              className="flex w-full justify-between gap-8"
              htmlFor="zip_code"
            >
              <span className="block shrink-0 text-sm font-medium text-slate-700">
                Zip/Postal code
              </span>
              <input
                type="text"
                name="apartment_suite"
                className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
              />
            </label>
            <label
              className="flex w-full justify-between gap-8"
              htmlFor="email"
            >
              <span className="block shrink-0 text-sm font-medium text-slate-700">
                Email
              </span>
              <input
                type="email"
                name="email"
                className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
              />
            </label>
            <label
              className="flex w-full justify-between gap-8"
              htmlFor="phone_number"
            >
              <span className="block shrink-0 text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                Phone number
              </span>
              <input
                type="text"
                name="phone_number"
                className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
              />
            </label>
            <label htmlFor="same_address" className="flex items-center gap-2">
              <input
                id="same_address"
                name="same_address"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              My billing and shipping address are the same
            </label>

            <label htmlFor="create_account" className="flex items-center gap-2">
              <input
                id="create_account"
                name="create_account"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              Create account for later use.
            </label>
            <div className="flex w-full items-center justify-between gap-2">
              <label className="flex flex-col gap-2" htmlFor="password">
                <span className="block shrink-0 text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                />
              </label>
              <label className="flex flex-col gap-2" htmlFor="confirm_password">
                <span className="block shrink-0 text-sm font-medium text-slate-700 after:ml-1.5 after:text-red-500 after:content-['*']">
                  Confirm password
                </span>
                <input
                  type="password"
                  name="confirm_password"
                  className="block w-full max-w-80 border border-slate-300 bg-white px-3 py-2 pl-2 pr-7 placeholder-slate-400 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2
              className={`${oswald.className} border-b border-slate-200 pb-4 text-2xl font-normal`}
            >
              Shipping Method
            </h2>
            <label className="flex items-center gap-3" htmlFor="dhl">
              <input
                defaultChecked
                type="radio"
                id="dhl"
                name="shipping"
                className="h-4 w-4 text-primary focus:ring-primary"
              />
              NGN 3000 (DHL)
            </label>
          </div>
          <ButtonPrimary className="w-fit" onClick={handleNextStep}>
            NEXT
          </ButtonPrimary>
        </div>
        <div className="w-1/3">
          <OrderSummary />
        </div>
      </div>
    </form>
  );
}
