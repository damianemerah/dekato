"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { oswald } from "@/font";
import usePaymentData from "@/app/hooks/usePaymentData";
import { SmallSpinner } from "@/app/ui/spinner";
import { CloseOutlined } from "@ant-design/icons";
import { deletePaymentMethod } from "@/app/action/paymentAction";
import { message } from "antd";
import { mutate } from "swr";

export default function Payment() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { paymentData: paymentMethods, isLoading: paymentIsLoading } =
    usePaymentData(userId);

  console.log(paymentMethods, "paymentMethods💎💎");

  const handleDelete = async (paymentId) => {
    try {
      await deletePaymentMethod(paymentId);
      mutate(`/api/payment/${userId}`, (prev) =>
        prev.filter((item) => item.id !== paymentId),
      );
      message.success("Payment method deleted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  if (paymentIsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
      <h2 className={`${oswald.className} border-b pb-2 text-2xl text-primary`}>
        Payment Methods
      </h2>
      {paymentMethods && paymentMethods.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {paymentMethods.map((card) => (
            <div
              key={card.id}
              className="relative rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:border-primary hover:shadow-md"
            >
              <CloseOutlined
                className={`absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-primary`}
                onClick={() => handleDelete(card.id)}
              />
              <div>
                <p className="font-semibold tracking-wide text-primary">
                  {card.cardType} **** **** **** {card.last4}
                </p>
                <p className="text-sm text-gray-600">
                  Expires: {card.expiryMonth}/{card.expiryYear}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-600">
          No payment methods available.
        </p>
      )}
    </div>
  );
}
