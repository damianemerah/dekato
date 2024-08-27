"use client";
import { useEffect } from "react";

export default function PaymentSuccess() {
  return (
    <div className="flex__center h-screen -translate-y-8">
      <div className="bg-white px-24 py-16 text-center">
        <h2 className="mb-5">Thank you for your purchase!</h2>
        <p>Your order has been placed successfully.</p>
        <p className="mb-12">
          We&apos;ll email you an order confirmation with details and tracking
          info.
        </p>
        <button className="bg-black px-9 py-4 text-white">
          Continue shopping
        </button>
      </div>
    </div>
  );
}
