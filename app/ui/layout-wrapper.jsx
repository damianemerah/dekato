"use client";

import React, { memo, useCallback } from "react";
import useSWR from "swr";
import Header from "@/app/ui/Header";
import PromoBar from "@/app/ui/promo-bar";
import Sidebar from "@/app/ui/sidebar";
import Footer from "@/app/ui/Footer";
import { useSidebarStore, useUserStore } from "@/store/store";
import { useSession } from "next-auth/react";
import { getUser } from "@/app/action/userAction";
import { toast } from "react-toastify";

// Global Fetcher function for SWR
const fetchUser = async (userId) => {
  return await getUser(userId);
};

const LayoutWrapper = ({ children }) => {
  const { data: session } = useSession();
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const setUser = useUserStore((state) => state.setUser);

  // Use a memoized fetcher to avoid unnecessary re-renders
  const memoizedFetchUser = useCallback(() => {
    return session?.user?.id ? fetchUser(session.user.id) : null;
  }, [session?.user?.id]);

  // Use SWR to fetch the full user object
  const { data: user, error: userError } = useSWR(
    session?.user?.id ? `/api/user/${session.user.id}` : null,
    memoizedFetchUser,
    {
      revalidateOnFocus: false,
      onSuccess: (fetchedUser) => {
        setUser(fetchedUser);
      },
      onError: (error) => {
        toast.error("Failed to log in. Please try again.");
      },
    },
  );

  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div
          className={`flex-1 pt-[60px] transition-all duration-300 ease-in-out ${
            isSidebarOpen ? "ml-[250px]" : "ml-0"
          }`}
        >
          <PromoBar />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default memo(LayoutWrapper);
