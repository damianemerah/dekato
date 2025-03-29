'use client';

import { CheckOutlined } from '@ant-design/icons';
import StoreIcon from '@/public/assets/icons/store.svg';
import HomeIcon from '@/public/assets/icons/home.svg';

export default function DeliveryMethodSelector({ method, onMethodChange }) {
  const renderDeliveryMethod = (
    value,
    icon,
    title,
    deliveryTime,
    deliveryFee
  ) => (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 ${
        method === value ? 'border-primary' : 'border-gray-300'
      }`}
      onClick={() => onMethodChange(value)}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full border ${
            method === value
              ? 'border-primary text-primary'
              : 'border-gray-300 text-gray-300'
          }`}
        >
          {method === value ? <CheckOutlined className="text-primary" /> : icon}
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-gray-600">{deliveryTime}</p>
        </div>
      </div>
      <p
        className={`text-sm font-medium ${
          deliveryFee === 'FREE' ? 'text-green-600' : 'text-gray-600'
        }`}
      >
        {deliveryFee}
      </p>
    </div>
  );

  return (
    <div>
      <h2 className="mb-6 text-lg font-medium text-primary">
        Choose delivery method
      </h2>
      <div className="mx-auto max-w-[320px] space-y-4 text-sm">
        {renderDeliveryMethod(
          'delivery',
          <HomeIcon className="h-8 w-8 stroke-2 text-primary" />,
          'Home or work address',
          '4 - 7 days',
          'FREE'
        )}
        {renderDeliveryMethod(
          'pickup',
          <StoreIcon className="h-8 w-8 stroke-2 text-primary" />,
          'Store pickup',
          '2 - 16 days',
          'FREE'
        )}
      </div>
    </div>
  );
}
