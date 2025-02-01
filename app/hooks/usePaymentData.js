"use client";

import useSWR from "swr";
import { getPaymentMethod } from "@/app/action/paymentAction";

const fetchPaymentMethods = (userId) => getPaymentMethod(userId);

export default function usePaymentData(userId) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    userId ? `/api/payment/${userId}` : null,
    () => (userId ? fetchPaymentMethods(userId) : null),
    {
      revalidateOnFocus: true,
      revalidateInterval: 1000 * 60 * 60 * 24,
    },
  );

  return {
    paymentData: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
