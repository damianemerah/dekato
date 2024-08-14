"use client";

import useSWR from "swr";
import { createContext, useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCategoryStore, useUserStore } from "@/store/store";
import { getCategories } from "@/app/action/categoryAction";

const AppContext = createContext();

// Fetcher function for SWR
const fetchCategories = async () => {
  try {
    return await getCategories(); // Fetch categories from your server action
  } catch (err) {
    throw new Error("Failed to fetch categories");
  }
};

export default function AppProvider({ children }) {
  const [show, setShow] = useState(false);
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const setCategory = useCategoryStore((state) => state.setCategory);

  // Use SWR to fetch categories
  const { data: categories } = useSWR("/api/categories", fetchCategories, {
    revalidateOnFocus: false,
    onSuccess: setCategory, // Set categories in Zustand on success
  });

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  return (
    <AppContext.Provider value={{ show, setShow }}>
      <div className="relative">{children}</div>
    </AppContext.Provider>
  );
}

function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export { AppProvider, useAppContext };
