"use client";

import { createContext, useState, useContext, useEffect, useRef } from "react";

const AppContext = createContext();

export default function AppProvider({ children }) {
  const [show, setShow] = useState(false);

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
