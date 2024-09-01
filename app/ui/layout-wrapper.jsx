"use client";

import React, { memo, useCallback, useState, useEffect } from "react";
import useSWR from "swr";
import PromoBar from "@/app/ui/promo-bar";
import Sidebar from "@/app/ui/sidebar";
import Footer from "@/app/ui/footer";
import { useSidebarStore, useUserStore } from "@/store/store";
import { useSession } from "next-auth/react";
import { getUser } from "@/app/action/userAction";
import { message } from "antd";

// Global Fetcher function for SWR
const fetchUser = async (userId) => {
  return await getUser(userId);
};

const LayoutWrapper = ({ children }) => {
  const { data: session } = useSession();
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
        message.error("Failed to log in. Please try again.");
      },
    },
  );

  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1250);
    };

    handleResize(); // Set the initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex justify-end">
      <Sidebar />
      <div
        className={`transition-all duration-300 ease-in-out ${isSidebarOpen && !isMobile ? "w-[calc(100%-250px)]" : "w-[100%]"}`}
      >
        <PromoBar />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </div>
    </div>
  );
};

export default memo(LayoutWrapper);
