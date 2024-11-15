"use client";

import Image from "next/image";
import { oswald } from "@/style/font";
import React, { useState } from "react";
import Link from "next/link";
import { deleteOrder } from "@/app/action/orderAction";
import DeleteIcon from "@/public/assets/icons/delete.svg";
import { ButtonSecondary } from "../../button";

import useSWR from "swr";

function OrderCard({ order }) {
  const handleDelete = async () => {
    try {
      await deleteOrder(order.id);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className="relative mb-4 border-2 border-gray-300 bg-white p-11">
      <div className="absolute right-3 top-3 cursor-pointer rounded-full fill-red-500 p-2 text-lg hover:bg-red-100">
        <DeleteIcon onClick={handleDelete} aria-label="Delete order" />
      </div>
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
          <span className="text-gray-500">{order?.paymentRef}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semdev old font-oswald text-lg">Total</span>
          <span className="text-gray-500">{order.total}</span>
        </div>
        <div className="flex gap-2">
          <Link href={`/account/orders/${order.id}`}>
            <ButtonSecondary
              className={`${oswald.className} border-2 border-primary bg-white text-sm uppercase text-primary transition-colors duration-300 hover:bg-primary hover:text-white`}
            >
              View details
            </ButtonSecondary>
          </Link>
        </div>
      </div>

      <div className="py-4">
        <span className="font-oswald text-lg font-semibold">
          Estimated Delivery :
        </span>
        <span className="ml-2 text-gray-500">
          {order?.deliveryStatus !== "delivered" || "Not yet delivered"}
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
  const [visibleOrders, setVisibleOrders] = useState(3);

  const showMoreOrders = () => {
    setVisibleOrders((prev) => prev + 3);
  };

  return (
    <div>
      {orders.slice(0, visibleOrders).map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}

      {visibleOrders < orders.length && (
        <div className="mt-4 flex justify-center">
          <ButtonSecondary
            onClick={showMoreOrders}
            className={`${oswald.className} border-2 border-primary bg-white text-sm uppercase text-primary transition-colors duration-300 hover:bg-primary hover:text-white`}
          >
            View More Orders
          </ButtonSecondary>
        </div>
      )}
    </div>
  );
};

export default OrderList;
