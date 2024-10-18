"use client";

import useSWR from "swr";
import { useUserStore } from "@/store/store";
import { getUser } from "@/app/action/userAction";

const fetchUser = (userId) => getUser(userId);

export default function useUserData(userId) {
  const { setUser, user } = useUserStore();

  const { isLoading, isValidating, error, data } = useSWR(
    userId ? `/api/user/${userId}` : null,
    () => (userId ? fetchUser(userId) : null),
    {
      onSuccess: setUser,
      revalidateOnFocus: false,
      fallbackData: user,
    },
  );

  console.log(data, "👇👇👇");

  return { userData: data, isLoading, isValidating, error };
}
