"use client";
import { useEffect } from "react";

export default function PaymentSuccess() {
  useEffect(() => {
    document.body.classList.add("bg-gray-100");
  }, []);
  return (
    <div className="flex__center h-screen">
      <div className="bg-white">PaymentSuccess</div>
    </div>
  );
}
