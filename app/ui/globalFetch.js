"use client";

import useSWR from "swr";
import useSWRImmutable from "swr/immutable";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/store";
import { getUser } from "@/app/action/userAction";

const fetchUser = async (userId) => {
  return await getUser(userId);
};

export default function GlobalFetch() {
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);

  const { isLoading } = useSWRImmutable(
    session?.user?.id ? `/api/user/${session.user.id}` : null,
    () => fetchUser(session.user.id),
    {
      onSuccess: (fetchedUser) => {
        setUser(fetchedUser);
      },
    },
  );
  return null;
}
