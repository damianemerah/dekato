"use client";

import { createContext, useState, useContext, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/store";

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [show, setShow] = useState(false);
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  return (
    <AppContext.Provider
      value={{
        show,
        setShow,
      }}
    >
      <div className="relative">{children}</div>
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  console.log("context", context);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export { AppProvider, useAppContext };
