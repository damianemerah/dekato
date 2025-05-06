"use client";

import Image from "next/image";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import { deleteOrder } from "@/app/action/orderAction";
import { X } from "lucide-react";
import { ButtonSecondary } from "../../button";
import useConfirmModal from "@/app/ui/confirm-modal";

function OrderCard({ order, onDelete }) {
  const showConfirmModal = useConfirmModal();

  const handleDelete = useCallback(() => {
    showConfirmModal({
      title: "Are you sure you want to delete this order?",
      content: "This action cannot be undone",
      async onOk() {
        try {
          await deleteOrder(order.id);
          onDelete(order.id);
        } catch (error) {
          console.error("Error deleting order:", error);
        }
      },
    });
  }, [order.id, onDelete, showConfirmModal]);

  return (
    <div className="relative mb-4 border-2 border-gray-300 bg-white p-4 sm:p-6 lg:p-8">
      <button
        onClick={handleDelete}
        className="absolute right-2 top-1.5 h-6 w-6 rounded-full text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:right-3 sm:top-3"
        aria-label="Delete order"
      >
        <X className="" />
      </button>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="mb-2 flex w-full flex-col sm:mb-0 sm:w-auto">
          <span className="font-oswald font-semibold md:text-lg">Status</span>
          <span className="text-green-600">
            {order?.status || "Pending/Canceled"}
          </span>
        </div>
        <div className="mb-2 flex w-full flex-col sm:mb-0 sm:w-auto">
          <span className="font-oswald font-semibold md:text-lg">
            Order Number
          </span>
          <span className="text-gray-500">{order?.paymentRef}</span>
        </div>
        <div className="mb-2 flex w-full flex-col sm:mb-0 sm:w-auto">
          <span className="font-oswald font-semibold md:text-lg">Total</span>
          <span className="text-gray-500">{order.total}</span>
        </div>
        <div className="mt-2 w-full sm:mt-0 sm:w-auto">
          <Link href={`/account/orders/${order.id}`} passHref>
            <ButtonSecondary
              className={`w-full border-2 border-primary bg-white font-oswald text-sm uppercase text-primary transition-colors duration-300 hover:bg-primary hover:text-white sm:w-auto`}
            >
              View details
            </ButtonSecondary>
          </Link>
        </div>
      </div>

      <div className="py-4">
        <span className={`font-oswald text-lg font-semibold`}>
          Estimated Delivery:
        </span>
        <span className="ml-2 text-gray-500">
          {order?.deliveryStatus !== "delivered"
            ? order?.deliveryStatus
            : "Not yet delivered"}
        </span>
      </div>

      {order?.product?.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-start justify-between border-t border-gray-200 py-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-start">
            <Image
              src={item.image}
              alt={item.name}
              width={96}
              height={96}
              className="mr-4 h-24 w-24 object-cover"
            />
            <div className="flex flex-col space-y-1">
              <span className={`font-oswald font-semibold`}>{item.name}</span>
              <span className="text-gray-500">{item.color}</span>
              <span className="font-medium">{item.price}</span>
            </div>
          </div>
          <div className="mt-2 text-right sm:mt-0">
            <span className="text-gray-600">Quantity: {item.quantity}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OrderList({ orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [visibleOrders, setVisibleOrders] = useState(3);

  const showMoreOrders = useCallback(() => {
    setVisibleOrders((prev) => prev + 3);
  }, []);

  const handleDeleteOrder = useCallback((deletedOrderId) => {
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order.id !== deletedOrderId),
    );
  }, []);

  return (
    <div className="space-y-4">
      {orders.slice(0, visibleOrders).map((order) => (
        <OrderCard key={order.id} order={order} onDelete={handleDeleteOrder} />
      ))}

      {visibleOrders < orders.length && (
        <div className="mt-6 flex justify-center">
          <ButtonSecondary
            onClick={showMoreOrders}
            className={`border-2 border-primary bg-white font-oswald text-sm uppercase text-primary transition-colors duration-300 hover:bg-primary hover:text-white`}
          >
            View More Orders
          </ButtonSecondary>
        </div>
      )}
    </div>
  );
}
