'use client';

import Image from 'next/image';
import { SmallSpinner } from '../../spinner';
import { ButtonSecondary } from '../../button';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { formatToNaira } from '@/app/utils/getFunc';

function OrderInfoItem({
  title,
  value,
  className = '',
  valueClassName = 'text-gray-600',
}) {
  return (
    <div>
      <h4
        className={`font-oswald text-sm font-semibold uppercase text-gray-500`}
      >
        {title}
      </h4>
      <p className={`${className} ${valueClassName}`}>{value}</p>
    </div>
  );
}

export default function OrderDetailClient({ orderData }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderData) {
      setOrder(orderData);
      setIsLoading(false);
    }
  }, [orderData]);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-[calc(100vh-35rem)] flex-col items-center justify-center gap-6">
        <p className="text-xl text-gray-600">Order not found</p>
        <Link href="/">
          <ButtonSecondary className="px-6 py-3">
            Continue Shopping
          </ButtonSecondary>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`mb-6 font-oswald text-2xl font-bold sm:text-3xl`}>
        Order Details
      </h1>
      <div className="rounded-lg border-2 border-gray-300 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <div className="mb-6 grid grid-cols-1 gap-6 border-b border-gray-200 pb-6 sm:grid-cols-2 lg:grid-cols-4">
          <OrderInfoItem
            title="Order Status"
            value={order?.status || 'Pending'}
            valueClassName="text-green-600"
          />
          <OrderInfoItem title="Order Number" value={order?.paymentRef} />
          <OrderInfoItem
            title="Order Date"
            value={new Date(order?.createdAt).toLocaleDateString()}
          />
          <OrderInfoItem
            title="Delivery Status"
            value={order?.deliveryStatus || 'Pending'}
            className="capitalize"
          />
        </div>

        <section className="mb-6" aria-labelledby="shipping-details">
          <h3
            id="shipping-details"
            className={`mb-4 font-oswald text-lg font-semibold`}
          >
            Shipping Details
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <OrderInfoItem
              title="Shipping Method"
              value={order?.shippingMethod}
              className="capitalize"
            />
            {order?.address && (
              <OrderInfoItem
                title="Delivery Address"
                value={`${order.address.firstname} ${order.address.lastname}, ${order.address.address}, ${order.address.city}, ${order.address.state} ${order.address.postalCode}, ${order.address.phone}`}
              />
            )}
          </div>
        </section>

        <section className="mb-6" aria-labelledby="order-items">
          <h3
            id="order-items"
            className={`mb-4 font-oswald text-lg font-semibold`}
          >
            Order Items
          </h3>
          <ul className="space-y-4">
            {order?.product?.map((item, index) => (
              <li
                key={index}
                className="flex flex-col border-b border-gray-200 pb-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="mr-4 rounded-md object-cover"
                  />
                  <div>
                    <h4 className={`font-oswald font-semibold`}>{item.name}</h4>
                    {item.option && (
                      <p className="text-sm text-gray-500">
                        {Object.entries(item.option)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </p>
                    )}
                    <p className="mt-1">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="mt-4 text-right sm:mt-0">
                  <p className="font-semibold">
                    {formatToNaira(item.price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between">
            <h3 className={`font-oswald text-xl font-semibold`}>Total</h3>
            <p className="text-xl font-semibold">
              {formatToNaira(order?.total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
