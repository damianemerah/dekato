"use client";
import { useEffect } from "react";

export default function PaymentSuccess() {
  useEffect(() => {
    document.body.classList.add("bg-gray-100");
  }, []);
  return (
    <div className="flex__center h-screen -translate-y-8">
      <div className="bg-white py-16 px-24 text-center">
        <h2 className="mb-5">Thank you for your purchase!</h2>
        <p>Your order has been placed successfully.</p>
        <p className="mb-12">
          We&apos;ll email you an order confirmation with details and tracking
          info.
        </p>
        <button className="bg-black text-white py-4 px-9">
          Continue shopping
        </button>
      </div>
    </div>
  );
}
