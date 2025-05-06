'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatToNaira } from '@/app/utils/getFunc';

export default function CartSummary({ checkoutData }) {
  const renderCartItems = useMemo(() => {
    return checkoutData?.items?.map((item, index) => {
      let originalPrice;
      if (item?.variantId && item?.product?.variant) {
        const variant = item.product.variant.find(
          (v) => v._id?.toString() === item.variantId?.toString()
        );
        originalPrice = variant?.price;
      } else {
        originalPrice = item?.product?.price;
      }

      return (
        <div
          key={item.id || index}
          className="flex min-h-20 items-start border-b pb-4"
        >
          <div className="h-20 w-20 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.product.name}
              width={80}
              height={80}
              className="h-full w-full rounded-md object-cover"
            />
          </div>
          <div className="ml-4 flex-grow text-sm">
            <p className="mb-1 line-clamp-2 overflow-ellipsis font-medium capitalize text-primary">
              {item.product.name}
            </p>
            {item.option && (
              <div className="mb-2 flex flex-wrap items-center">
                {Object.entries(item.option).map(([key, value], index) => (
                  <p
                    key={`${key}-${index}`}
                    className="mr-2 text-xs capitalize text-gray-600"
                  >
                    {key}: {value}
                  </p>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">
                {`${item.quantity} item${item.quantity > 1 ? 's' : ''}`}
              </p>
              <p className="mr-4 flex flex-col items-center justify-center text-primary">
                {item?.product?.isDiscounted && originalPrice && (
                  <span className="mr-2 text-sm text-gray-500 line-through">
                    {formatToNaira(originalPrice)}
                  </span>
                )}
                <span className="text-base font-medium text-primary">
                  {formatToNaira(item.currentPrice || 0)}
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    });
  }, [checkoutData?.items]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between pb-4">
        <h2 className="text-xl font-semibold text-primary">
          {`${checkoutData?.itemCount || 0} Item${
            checkoutData?.itemCount > 1 ? 's' : ''
          }`}
        </h2>
        <Link
          href="/cart"
          className="border-b border-gray-600 text-sm text-gray-600 transition-colors duration-200 hover:text-primary"
        >
          Edit
        </Link>
      </div>
      <div className="mb-4 flex items-center border border-primary px-4 py-2 text-sm text-gray-600">
        <InfoCircleOutlined className="mr-2 flex-shrink-0 text-lg" />
        <div>
          <strong className="mb-1 block">Items not reserved</strong>
          <p>Checkout now to make them yours</p>
        </div>
      </div>

      <div className="mb-6 space-y-4">{renderCartItems}</div>

      {/* Total Section */}
      <div className="space-y-2 text-sm font-medium tracking-wide text-primary">
        <div className="flex items-center justify-between">
          <p>Subtotal</p>
          <p>{formatToNaira(checkoutData?.totalPrice)}</p>
        </div>
        <div className="flex items-center justify-between">
          <p>Shipping</p>
          <p className="text-green-600">Free</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <p>Total</p>
          <p>{formatToNaira(checkoutData?.totalPrice)}</p>
        </div>
      </div>
    </div>
  );
}
