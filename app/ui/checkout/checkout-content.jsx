"use client";

import { useUserStore } from "@/store/store";
import Image from "next/image";
import StoreIcon from "@/public/assets/icons/store.svg";
import HomeIcon from "@/public/assets/icons/home.svg";
import { ButtonPrimary } from "../button";
import { useState, useEffect, useMemo } from "react";
import AddressOption from "@/app/ui/checkout/addressForm";
import { getCheckoutData } from "@/app/action/checkoutAction";
import { SmallSpinner } from "@/app/ui/spinner";
import PlusIcon from "@/public/assets/icons/add.svg";
import { message } from "antd";
import useSWR from "swr";
import Link from "next/link";
import { InfoCircleOutlined } from "@ant-design/icons";
import { oswald } from "@/font";
import { useSession } from "next-auth/react";
import useUserData from "../useUserData";

export default function CheckoutContent({ initialData }) {
  const [changeAddress, setChangeAddress] = useState(false);
  const [address, setAddress] = useState(null);
  const { deliveryMethod, setDeliveryMethod } = useUserStore();

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    userData: user,
    isLoading: userIsLoading,
    isValidating: userIsValidating,
    error,
  } = useUserData(userId);


  useEffect(() => {
    setAddress(user?.address?.find((add) => add.isDefault));
  }, [user]);

  const { data: checkoutData, isValidating: checkoutIsValidating } = useSWR(
    "/checkout-data",
    () => getCheckoutData(user?.id),
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
    },
  );

  const handleDeliveryMethodClick = (method) => {
    setDeliveryMethod(method);
  };

  const handlePayment = async () => {
    const data = {
      userId: user?.id,
      shippingMethod: deliveryMethod,
      address: user?.address,
      email: user?.email,
      items: checkoutData?.product,
      amount: checkoutData.amount,
    };

    try {
      if (data.items.length > 0) {
        const res = await fetch(`/api/checkout/${user?.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const response = await res.json();

        window.location.href = response.data.payment.data.authorization_url;
        return response;
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while processing your payment");
    }
  };

  const renderDeliveryMethod = (method, icon, title, days, price) => (
    <div
      className={`flex cursor-pointer items-center justify-between p-4 transition-all duration-300 ${
        deliveryMethod === method
          ? "border-2 border-primary bg-blue-50"
          : "border border-gray-200 hover:border-primary"
      }`}
      onClick={() => handleDeliveryMethodClick(method)}
    >
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <p className="font-semibold tracking-wide text-primary">{title}</p>
          <p className="text-gray-600">{days}</p>
        </div>
      </div>
      <p className="font-medium text-green-600">{price}</p>
    </div>
  );

  const renderAddress = () => {
    if (address && deliveryMethod === "delivery") {
      return (
        <div className="flex items-center justify-between border border-primary px-6 py-4 text-sm">
          <div className="flex items-center gap-4">
            <div>
              <p className="mb-1 flex items-center gap-3">
                <span className="font-medium tracking-wide text-primary">
                  {address?.firstname} {address?.lastname}
                </span>
                <span className="text-gray-600">{address?.phone}</span>
              </p>
              <p className="text-gray-700">{address?.address}</p>
              <p className="text-gray-700">{`${address?.city ? address?.city + ", " : ""}${address?.state ? address?.state + ", " : ""}${address?.country ? address?.country : ""}`}</p>
            </div>
          </div>
          <button
            onClick={() => setChangeAddress(!changeAddress)}
            className="border-b border-primary text-base leading-4 text-primary transition-opacity duration-200 hover:opacity-70"
          >
            Change
          </button>
        </div>
      );
    } else if (deliveryMethod === "delivery") {
      return (
        <div className="flex items-center justify-between border-2 border-dashed border-gray-300 p-6">
          <p className="text-gray-600">No address found</p>
          <button
            onClick={() => setChangeAddress(!changeAddress)}
            className="flex items-center justify-center space-x-2 border-b border-primary px-4 py-2 text-sm uppercase leading-4 text-primary transition-colors duration-200 hover:text-opacity-70"
          >
            <PlusIcon className="leading-3" />
            <span className="leading-3">Add address</span>
          </button>
        </div>
      );
    } else {
      return (
        <div className="bg-blue-50 p-4 text-sm text-gray-700">
          <p>You&apos;ve selected store pickup. Please proceed to payment.</p>
        </div>
      );
    }
  };

  const renderCartItems = useMemo(() => {
    return checkoutData?.product?.map((item, index) => (
      <div key={index} className="flex min-h-20 items-start border-b pb-4">
        <div className="h-20 w-20 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.name}
            width={80}
            height={80}
            className="h-full w-full rounded-md object-cover"
          />
        </div>
        <div className="ml-4 flex-grow text-sm">
          <p className="mb-1 line-clamp-2 overflow-ellipsis font-medium capitalize text-primary">
            {item.name}
          </p>
          {item.option && (
            <div className="mb-2 flex flex-wrap items-center">
              {Object.entries(item.option).map(([key, value], index) => (
                <p
                  key={index}
                  className="mr-2 text-xs capitalize text-gray-600"
                >
                  {key}: {value}
                </p>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-600">
              {`${item.quantity} item${item.quantity > 1 ? "s" : ""}`}
            </p>
            <p className="font-medium">₦{item.price}</p>
          </div>
        </div>
      </div>
    ));
  }, [checkoutData?.product]);

  if (userIsLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <SmallSpinner className="!text-primary" />
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[942px]">
      {/* {userIsValidating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <SmallSpinner className="!text-primary" />
        </div>
      )} */}
      <div className="mx-auto flex flex-col gap-8 md:flex-row">
        {/* Left Section */}
        <div className="w-full md:w-2/3">
          {/* Delivery Method */}
          <section className="mb-8 bg-white px-6 py-8 shadow-sm">
            <h2 className="mb-6 text-lg font-medium text-primary">
              Choose delivery method
            </h2>
            <div className="mx-auto max-w-[320px] space-y-4 text-sm">
              {renderDeliveryMethod(
                "delivery",
                <HomeIcon className="h-8 w-8 stroke-2 text-primary" />,
                "Home or work address",
                "4 - 7 days",
                "FREE",
              )}
              {renderDeliveryMethod(
                "pickup",
                <StoreIcon className="h-8 w-8 stroke-2 text-primary" />,
                "Store pickup",
                "2 - 16 days",
                "FREE",
              )}
            </div>

            <h2
              className={`${oswald.className} mb-6 mt-10 text-xl font-bold tracking-wide text-primary`}
            >
              Shipping address
            </h2>
            {renderAddress()}

            {deliveryMethod === "delivery" && (
              <AddressOption
                {...{
                  changeAddress,
                  setChangeAddress,
                  addresses: user?.address,
                }}
              />
            )}
          </section>
        </div>

        {/* Right Section - Cart Summary */}
        <div className="w-full md:w-1/3">
          <section className="bg-white px-6 py-8 shadow-sm">
            <div className="mb-4 flex items-center justify-between pb-4">
              <h2 className="text-xl font-semibold text-primary">{`${checkoutData?.itemCount} Item${
                checkoutData?.totalItems > 1 ? "s" : ""
              }`}</h2>
              <Link
                href="/cart"
                className="border-b border-gray-600 text-sm text-gray-600 transition-colors duration-200 hover:text-primary"
              >
                Edit
              </Link>
            </div>
            <div className="mb-4 flex items-center border border-primary px-4 py-2 text-sm text-gray-600">
              <InfoCircleOutlined className="mr-2 flex-shrink-0 text-lg" />
              <div>
                <strong className="mb-1 block">Items not reserved</strong>
                <p>Checkout now to make them yours</p>
              </div>
            </div>

            <div className="mb-6 space-y-4">{renderCartItems}</div>

            {/* Total Section */}
            <div className="space-y-2 text-sm font-medium tracking-wide text-primary">
              <div className="flex items-center justify-between">
                <p>Subtotal</p>
                <p>₦{checkoutData?.totalPrice}</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Shipping</p>
                <p className="text-green-600">Free</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p>Total</p>
                <p>₦{checkoutData?.totalPrice}</p>
              </div>
            </div>

            <div className="mt-6">
              <ButtonPrimary
                className="w-full bg-secondary py-3 text-sm font-medium tracking-wider"
                onClick={handlePayment}
              >
                Review & Pay
              </ButtonPrimary>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
