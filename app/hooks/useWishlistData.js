'use client';

import useSWR from 'swr';
import { getUser } from '@/app/action/userAction';

const fetchWishlist = async ([, userId]) => {
  if (!userId) return null;
  try {
    const userData = await getUser(userId);
    return {
      count: userData?.wishlist?.length || 0,
      items: userData?.wishlist || [],
    };
  } catch (error) {
    console.error('Error fetching wishlist data:', error);
    return { count: 0, items: [] }; // Return default on error
  }
};

export default function useWishlistData(userId) {
  const { data, isLoading, isValidating, error, mutate } = useSWR(
    userId ? [`wishlist-data`, userId] : null,
    fetchWishlist,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // Dedupe requests within 10 seconds
      errorRetryCount: 2,
    }
  );

  return {
    wishlistData: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
