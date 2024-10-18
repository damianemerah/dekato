import React, { useState } from "react";
import OrderCard from "@/app/ui/order-card";
import { oswald } from "@/style/font";

const OrderSummary = () => {
  // State to track visibility of the order cards
  const [isOrderCardVisible, setIsOrderCardVisible] = useState(false);

  // Function to toggle the visibility
  const toggleOrderCardVisibility = () => {
    setIsOrderCardVisible(!isOrderCardVisible);
  };

  return (
    <div className="divide-y divide-grayOutline border border-grayOutline bg-grayBg p-5">
      <h2
        className={`${oswald.className} mb-1.5 pb-2.5 text-2xl font-normal leading-5`}
      >
        Order Summary
      </h2>
      <div
        className={`${oswald.className} py-2.5 text-lg font-medium text-grayText`}
      >
        <div className="flex justify-between">
          <p>Cart Subtotal</p>
          <p>$56.25</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping</p>
          <p>$5</p>
        </div>
      </div>
      <div className="py-2.5">
        <div
          className={`${oswald.className} mb-2 flex justify-between text-lg font-medium`}
        >
          <p>Total</p>
          <p>$56.25</p>
        </div>
        <div className="flex items-center justify-between">
          <p>1 item in cart</p>
          <button onClick={toggleOrderCardVisibility} type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#303030"
              className={`transform transition-transform ${
                isOrderCardVisible ? "rotate-180" : ""
              }`}
            >
              <path d="M480-360 280-560h400L480-360Z" />
            </svg>
          </button>
        </div>
      </div>
      {/* Conditional rendering of OrderCards */}
      {isOrderCardVisible && (
        <div className="divide-y divide-grayOutline">
          <OrderCard />
          <OrderCard />
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
