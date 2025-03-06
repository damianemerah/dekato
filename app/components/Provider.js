"use client";
import { SessionProvider } from "next-auth/react";

export default function Provider({ children }) {
  return (
    <SessionProvider
      refetchInterval={24 * 60 * 60 * 1000}
      refetchOnWindowFocus={false}
      refetchOnReconnect={false}
      refetchOnMount={false}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
