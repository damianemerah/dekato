'use client';

import useSWR from 'swr';
import { useAddressStore } from '@/app/store/store';
import { getUserAddress } from '@/app/action/userAction';

const fetchUserAddress = (userId) => getUserAddress(userId);

export default function useAddressData(userId) {
  const { setAddress, address } = useAddressStore();

  const { isLoading, isValidating, error, data } = useSWR(
    userId ? `/api/userAddress/${userId}` : null,
    () => (userId ? fetchUserAddress(userId) : null),
    {
      onSuccess: setAddress,
      revalidateOnFocus: true,
      fallbackData: address,
    }
  );

  return { addressData: data, isLoading, isValidating, error };
}
