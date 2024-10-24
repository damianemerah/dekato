import { useState, useEffect, useMemo } from "react";

const useIsBelowThreshold = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return useMemo(() => width < 1250, [width]);
};

export default useIsBelowThreshold;
