"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook for detecting media query matches
 * @param {string} query - The media query to check (e.g., '(min-width: 768px)')
 * @returns {boolean} Whether the media query matches
 */
export function useMediaQuery(query) {
  // Default to false for SSR
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // Set initial match state on client side
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Create event listener function
    const listener = (e) => {
      setMatches(e.matches);
    };

    // Add event listener
    media.addEventListener("change", listener);

    // Clean up event listener when component unmounts
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
