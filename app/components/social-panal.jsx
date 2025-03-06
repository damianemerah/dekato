"use client";

import { useState, useEffect, useCallback, memo } from "react";
import XIcon from "@/public/assets/icons/twitter.svg";
import FbIcon from "@/public/assets/icons/facebook-share.svg";
import InstaIcon from "@/public/assets/icons/instagram-share.svg";
import WhatsappIcon from "@/public/assets/icons/whatsapp.svg";

const SocialSharePanel = memo(function SocialSharePanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({
    x: typeof window !== "undefined" ? window.innerWidth - 40 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback(
    (e) => {
      const clientX = e.type === "mousedown" ? e.clientX : e.touches[0].clientX;
      const clientY = e.type === "mousedown" ? e.clientY : e.touches[0].clientY;

      setIsDragging(true);
      setDragStart({
        x: clientX - position.x,
        y: clientY - position.y,
      });
    },
    [position],
  );

  const handleDrag = useCallback(
    (e) => {
      if (!isDragging) return;

      e.preventDefault();
      const clientX = e.type === "mousemove" ? e.clientX : e.touches[0].clientX;
      const clientY = e.type === "mousemove" ? e.clientY : e.touches[0].clientY;

      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;

      // Constrain to viewport bounds
      const maxX = window.innerWidth - 100; // panel width estimate
      const maxY = window.innerHeight - 200; // panel height estimate

      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
      });
    },
    [isDragging, dragStart],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDrag);
      window.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  const handleButtonClick = (e) => {
    if (!isDragging) {
      if (!isExpanded) {
        // When expanding, move panel left to make room for the social icons
        setPosition((prev) => ({
          ...prev,
          x: Math.max(0, prev.x - 100), // Move left by 100px or until edge
        }));
      } else {
        // When collapsing, move back to right edge
        setPosition((prev) => ({
          ...prev,
          x: typeof window !== "undefined" ? window.innerWidth - 40 : 0,
        }));
      }
      setIsExpanded(!isExpanded);
    }
  };

  // Add resize handler to keep panel at right edge when collapsed
  useEffect(() => {
    const handleResize = () => {
      if (!isExpanded) {
        setPosition((prev) => ({
          ...prev,
          x: window.innerWidth - 40,
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  return (
    <div
      className="fixed z-20"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
    >
      <div
        className="flex items-center transition-transform duration-300"
        style={{
          transform: isExpanded
            ? "translateX(0)"
            : "translateX(calc(100% - 40px))",
        }}
      >
        <button
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={handleButtonClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-md"
          aria-label={
            isExpanded ? "Collapse share panel" : "Expand share panel"
          }
          aria-expanded={isExpanded}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {isExpanded && (
          <div
            className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <button
              className="transition-colors hover:text-primary"
              aria-label="Share on Twitter"
            >
              <XIcon className="h-5 w-5" />
            </button>
            <button
              className="transition-colors hover:text-primary"
              aria-label="Share on Facebook"
            >
              <FbIcon className="h-5 w-5" />
            </button>
            <button
              className="transition-colors hover:text-primary"
              aria-label="Share on Instagram"
            >
              <InstaIcon className="h-5 w-5" />
            </button>
            <button
              className="transition-colors hover:text-primary"
              aria-label="Share on WhatsApp"
            >
              <WhatsappIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default SocialSharePanel;
