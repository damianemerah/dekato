"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { InfoCircleOutlined, CheckOutlined } from "@ant-design/icons";

import CheckoutProgress from "@/app/ui/checkout-progress";
import { ButtonPrimary, ButtonSecondary } from "@/app/ui/button";
import { SmallSpinner } from "@/app/ui/spinner";
import AddressOption from "@/app/ui/checkout/addressForm";
import { useUserStore } from "@/store/store";
import useUserData from "@/app/hooks/useUserData";
import useAddressData from "@/app/hooks/useAddressData";
import usePaymentData from "@/app/hooks/usePaymentData";
import { getCheckoutData } from "@/app/action/checkoutAction";
import { updatePaymentMethod } from "@/app/action/paymentAction";
import { formatToNaira } from "@/utils/getFunc";
import { oswald } from "@/style/font";

import StoreIcon from "@/public/assets/icons/store.svg";
import HomeIcon from "@/public/assets/icons/home.svg";
import PlusIcon from "@/public/assets/icons/add.svg";
import { message } from "antd";

function PaymentOption({
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isUpdatingPayment,
  setIsUpdatingPayment,
  mutatePaymentData,
}) {
  const handlePaymentMethodSelect = async (paymentMethodId) => {
    setIsUpdatingPayment(true);
    try {
      await updatePaymentMethod(paymentMethodId, { isDefault: true });
      setSelectedPaymentMethod(paymentMethodId);
      await mutatePaymentData();
    } catch (error) {
      console.error("Error updating payment method:", error);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  return (
    <div className="mt-4 text-sm">
      <h2 className="mb-6 text-lg font-medium text-primary">
        Choose payment method
      </h2>
      <div className="mx-auto max-w-[320px] space-y-4 text-sm">
        {paymentMethods?.map((paymentMethod) => (
          <div
            key={paymentMethod.id}
            className={`flex cursor-pointer items-center justify-between p-4 transition-all duration-300 ${
              selectedPaymentMethod === paymentMethod.id
                ? "border-2 border-primary bg-blue-50"
                : "border border-gray-200 hover:border-primary"
            }`}
            onClick={() => handlePaymentMethodSelect(paymentMethod.id)}
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold tracking-wide text-primary">
                  {paymentMethod.authorization.card_type} ****{" "}
                  {paymentMethod.authorization.last4}
                </p>
                <p className="text-gray-600">
                  Expires: {paymentMethod.authorization.exp_month}/
                  {paymentMethod.authorization.exp_year}
                </p>
              </div>
            </div>
            {selectedPaymentMethod === paymentMethod.id &&
              (isUpdatingPayment ? (
                <SmallSpinner />
              ) : (
                <CheckOutlined className="text-primary" />
              ))}
          </div>
        ))}
        <button
          onClick={() => setSelectedPaymentMethod(null)}
          className={`flex w-full cursor-pointer items-center justify-between border p-4 transition-all duration-300 ${
            !selectedPaymentMethod
              ? "border-2 border-primary bg-blue-50"
              : "border-gray-200 hover:border-primary"
          }`}
          type="button"
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="font-semibold tracking-wide text-primary">
                Pay with new card
              </p>
            </div>
          </div>
          {!selectedPaymentMethod && <CheckOutlined className="text-primary" />}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [changeAddress, setChangeAddress] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { deliveryMethod, setDeliveryMethod } = useUserStore();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    paymentData: paymentMethods,
    isLoading: paymentIsLoading,
    mutate: mutatePaymentData,
  } = usePaymentData(userId);
  const { addressData: address, isLoading: addressIsLoading } =
    useAddressData(userId);
  const { userData: user, isLoading: userIsLoading } = useUserData(userId);

  const { data: checkoutData, isLoading: checkoutIsLoading } = useSWR(
    userId ? "/checkout-data" : null,
    () => userId && getCheckoutData(userId),
    {
      revalidateOnFocus: true,
    },
  );

  useEffect(() => {
    if (paymentMethods?.length > 0) {
      const defaultPaymentMethod = paymentMethods.find(
        (method) => method.isDefault,
      );
      if (defaultPaymentMethod) {
        setSelectedPaymentMethod(defaultPaymentMethod.id);
      }
    }
  }, [paymentMethods]);

  const handleDeliveryMethodClick = (method) => {
    setDeliveryMethod(method);
  };

  const handlePayment = async () => {
    if (isProcessingPayment || !user) return;

    setIsProcessingPayment(true);
    const saveCard = selectedPaymentMethod
      ? false
      : document.querySelector('input[name="saveCard"]')?.checked;

    const data = {
      userId: user?.id,
      shippingMethod: deliveryMethod,
      address: address?.find((add) => add.isDefault),
      email: user?.email,
      items: checkoutData?.items,
      amount: checkoutData?.totalPrice,
      saveCard,
      cardId: selectedPaymentMethod,
    };

    console.log(data.amount, 12121);

    try {
      if (data.items.length > 0) {
        const res = await fetch(`/api/checkout/${user.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const response = await res.json();

        if (response.success) {
          window.location.href = response.data.payment.data.authorization_url;
        }
        if (!response.success) {
          throw new Error(response.message || "Something went wrong");
        }
      }
    } catch (error) {
      message.info(error.message);
    } finally {
      setIsProcessingPayment(false);
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
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleDeliveryMethodClick(method);
        }
      }}
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

  const renderAddress = (address) => {
    const defaultAddress = address?.find((add) => add.isDefault);

    if (defaultAddress && deliveryMethod === "delivery") {
      return (
        <div className="flex items-center justify-between border border-primary px-6 py-4 text-sm">
          <div className="flex items-center gap-4">
            <div>
              <p className="mb-1 flex items-center gap-3">
                <span className="font-medium tracking-wide text-primary">
                  {defaultAddress?.firstname} {defaultAddress?.lastname}
                </span>
                <span className="text-gray-600">{defaultAddress?.phone}</span>
              </p>
              <p className="text-gray-700">{defaultAddress?.address}</p>
              <p className="text-gray-700">
                {[
                  defaultAddress?.city,
                  defaultAddress?.state,
                  defaultAddress?.country,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>
          <button
            onClick={() => setChangeAddress(!changeAddress)}
            className="border-b border-primary text-base leading-4 text-primary transition-opacity duration-200 hover:opacity-70"
            type="button"
          >
            Change
          </button>
        </div>
      );
    }

    if (deliveryMethod === "delivery") {
      return (
        <div className="flex items-center justify-between border-2 border-dashed border-gray-300 p-6">
          <p className="text-gray-600">No address found</p>
          <button
            onClick={() => setChangeAddress(!changeAddress)}
            className="flex items-center justify-center space-x-2 border-b border-primary px-4 py-2 text-sm uppercase leading-4 text-primary transition-colors duration-200 hover:text-opacity-70"
            type="button"
          >
            <PlusIcon className="leading-3" />
            <span className="leading-3">Add address</span>
          </button>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 p-4 text-sm text-gray-700">
        <p>You&apos;ve selected store pickup. Please proceed to payment.</p>
      </div>
    );
  };

  const renderCartItems = useMemo(() => {
    return checkoutData?.items?.map((item, index) => (
      <div
        key={item.id || index}
        className="flex min-h-20 items-start border-b pb-4"
      >
        <div className="h-20 w-20 flex-shrink-0">
          <Image
            src={item.image}
            alt={item.product.name}
            width={80}
            height={80}
            className="h-full w-full rounded-md object-cover"
          />
        </div>
        <div className="ml-4 flex-grow text-sm">
          <p className="mb-1 line-clamp-2 overflow-ellipsis font-medium capitalize text-primary">
            {item.product.name}
          </p>
          {item.option && (
            <div className="mb-2 flex flex-wrap items-center">
              {Object.entries(item.option).map(([key, value], index) => (
                <p
                  key={`${key}-${index}`}
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
            <p className="mr-4 flex flex-col items-center justify-center text-primary">
              {item?.product?.isDiscounted && (
                <span className="mr-2 text-sm text-gray-500 line-through">
                  {item?.variantId
                    ? formatToNaira(
                        item?.product?.variant?.find(
                          (v) =>
                            v._id.toString() === item?.variantId.toString(),
                        )?.price,
                      )
                    : formatToNaira(item?.product?.price)}
                </span>
              )}
              <span className="text-base font-medium text-primary">
                {formatToNaira(item.currentPrice)}
              </span>
            </p>
          </div>
        </div>
      </div>
    ));
  }, [checkoutData?.items]);

  const isLoading =
    userIsLoading || checkoutIsLoading || paymentIsLoading || addressIsLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <SmallSpinner className="!text-primary" />
        <p>Loading...</p>
      </div>
    );
  }

  if (checkoutData && !checkoutData.itemCount) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <p className="text-xl text-gray-600">No product selected</p>
        <Link href="/">
          <ButtonSecondary className="px-6 py-3">
            Continue Shopping
          </ButtonSecondary>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-grayBg">
      <div className="mx-auto max-w-[942px]">
        <CheckoutProgress />
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

              <h2 className="mb-6 mt-10 font-oswald text-xl font-bold tracking-wide text-primary">
                Shipping address
              </h2>
              {renderAddress(address)}

              {deliveryMethod === "delivery" && (
                <AddressOption
                  changeAddress={changeAddress}
                  setChangeAddress={setChangeAddress}
                  addresses={address}
                />
              )}

              {paymentMethods?.length > 0 && (
                <PaymentOption
                  paymentMethods={paymentMethods}
                  selectedPaymentMethod={selectedPaymentMethod}
                  setSelectedPaymentMethod={setSelectedPaymentMethod}
                  isUpdatingPayment={isUpdatingPayment}
                  setIsUpdatingPayment={setIsUpdatingPayment}
                  mutatePaymentData={mutatePaymentData}
                />
              )}
            </section>
          </div>

          {/* Right Section - Cart Summary */}
          <div className="w-full md:w-1/3">
            <section className="mb-8 bg-white px-6 py-8 shadow-sm">
              <div className="mb-4 flex items-center justify-between pb-4">
                <h2 className="text-xl font-semibold text-primary">
                  {`${checkoutData?.itemCount || 0} Item${
                    checkoutData?.itemCount > 1 ? "s" : ""
                  }`}
                </h2>
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
                  <p>{formatToNaira(checkoutData?.totalPrice)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p>Shipping</p>
                  <p className="text-green-600">Free</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p>Total</p>
                  <p>{formatToNaira(checkoutData?.totalPrice)}</p>
                </div>
              </div>
              {!selectedPaymentMethod && (
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveCard"
                      className="mr-2 h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:border-primary checked:bg-primary checked:bg-contain checked:bg-center checked:bg-no-repeat focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    />
                    <span className="text-sm text-gray-600">
                      Save card for future purchases
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-6">
                <ButtonPrimary
                  className="w-full bg-secondary py-3 text-sm font-medium tracking-wider"
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center justify-center gap-2">
                      <SmallSpinner />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Review & Pay"
                  )}
                </ButtonPrimary>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
