import Image from "next/image";
import React from "react";

function OrderCard({ status, orderNumber, total, deliveryDate, items }) {
  return (
    <div className="mb-4 border-2 border-gray-300 bg-[#F0F2F2] p-11">
      <div className="flex items-center justify-between border-b border-gray-300 pb-4">
        <div className="flex flex-col">
          <span className="font-oswald text-lg font-semibold">Status</span>
          <span className="text-[#27AE60]">{status}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-oswald text-lg font-semibold">
            Order Number
          </span>
          <span className="text-gray-500">{orderNumber}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-oswald text-lg font-semibold">Total</span>
          <span className="text-gray-500">{total}</span>
        </div>
        <button className="border-2 border-[#C4C4C4] px-4 py-2 text-sm">
          View details
        </button>
      </div>

      <div className="py-4">
        <span className="font-oswald text-lg font-semibold">
          Estimated Delivery :
        </span>
        <span className="ml-2 text-gray-500">{deliveryDate}</span>
      </div>

      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between py-4">
          <div className="flex items-start">
            <Image
              src={item.image}
              alt={item.name}
              width={96}
              height={96}
              className="mr-4 h-24 w-24 object-cover"
            />
            <div className="flex flex-col space-y-2">
              <span className="font-oswald font-semibold">{item.name}</span>
              <span className="text-gray-500">{item.color}</span>
              <span className="">{item.price}</span>
            </div>
          </div>
          <div className="text-right">
            <span>x{item.quantity}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderCard;
