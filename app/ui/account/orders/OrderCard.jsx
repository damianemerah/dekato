import Image from "next/image";
import { oswald } from "@/font";
import React from "react";

function OrderCard({ order }) {
  return (
    <div className="mb-4 border-2 border-gray-300 bg-white p-11">
      <div className="flex items-center justify-between border-b border-gray-300 pb-4">
        <div className="flex flex-col">
          <span className="font-oswald text-lg font-semibold">Status</span>
          <span className="text-[#27AE60]">
            {order?.status || "Pending/Canceled"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-oswald text-lg font-semibold">
            Order Number
          </span>
          <span className="text-gray-500">{order?.receiptNumber}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semdev old font-oswald text-lg">Total</span>
          <span className="text-gray-500">{order.total}</span>
        </div>
        <button className="border-2 border-[#C4C4C4] px-4 py-2 text-sm">
          View details
        </button>
      </div>

      <div className="py-4">
        <span className="font-oswald text-lg font-semibold">
          Estimated Delivery :
        </span>
        <span className="ml-2 text-gray-500">
          {order?.deliveryDate || "Not yet delivered"}
        </span>
      </div>

      {order?.product?.map((item, index) => (
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
              <span className={`${oswald.className} font-oswald font-semibold`}>
                {item.name}
              </span>
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

const OrderList = ({ orders }) => {
  return orders.map((order) => <OrderCard key={order.id} order={order} />);
};

export default OrderList;
