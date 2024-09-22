"use client";

import useSWRImmutable from "swr/immutable";
import { useSession } from "next-auth/react";
import { useUserStore, useCartStore } from "@/store/store";
import { getUser } from "@/app/action/userAction";
import { getCart } from "@/app/action/cartAction";
import { useEffect } from "react";

const fetcher = async (id) => {
  return await getCart(id);
};

const fetchUser = async (userId) => {
  return await getUser(userId);
};

export default function GlobalFetch() {
  const { data: session } = useSession();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const setCart = useCartStore((state) => state.setCart);
  const setCartIsLoading = useCartStore((state) => state.setCartIsLoading);
  const setUserIsLoading = useUserStore((state) => state.setUserIsLoading);

  const { isLoading: cartIsLoading } = useSWRImmutable(
    user?.id ? `/cart/${user.id}` : null,
    () => (user?.id ? fetcher(user.id) : null),
    {
      onSuccess: (data) => {
        setCart(data.item);
      },
    },
  );

  const { isLoading: userIsLoading } = useSWRImmutable(
    session?.user?.id ? `/api/user/${session.user.id}` : null,
    () => fetchUser(session.user.id),
    {
      onSuccess: (fetchedUser) => {
        setUser(fetchedUser);
      },
    },
  );

  useEffect(() => {
    setUserIsLoading(userIsLoading);
  }, [userIsLoading, setUserIsLoading]);

  useEffect(() => {
    setCartIsLoading(cartIsLoading);
  }, [cartIsLoading, setCartIsLoading]);

  return null;
}
