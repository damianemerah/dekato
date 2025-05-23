'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { SmallSpinner } from '@/app/components/spinner';
import { CloseOutlined } from '@ant-design/icons';
import { deletePaymentMethod } from '@/app/action/paymentAction';
import { message } from 'antd';

export default function Payment({ initialPaymentMethods }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialPaymentMethods) {
      message.error('Failed to fetch payment methods');
      setIsLoading(false);
      return;
    }
    if (initialPaymentMethods) {
      setPaymentMethods(initialPaymentMethods);
      setIsLoading(false);
    }
  }, [initialPaymentMethods]);

  const handleDelete = async (paymentId) => {
    try {
      const result = await deletePaymentMethod(paymentId);

      if (result?.error) {
        message.error('Failed to delete payment method');
        return;
      }

      // Update local state
      setPaymentMethods((prev) => prev.filter((item) => item.id !== paymentId));

      message.success('Payment method deleted successfully');
    } catch (error) {
      console.log(error);
      message.error('Failed to delete payment method');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="my-6 font-oswald text-xl font-medium uppercase text-gray-700">
        Payment Methods
      </h1>
      {paymentMethods && paymentMethods.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((card) => (
            <div
              key={card.id}
              className="relative border border-gray-200 p-4 transition-all duration-300 hover:border-primary hover:shadow-sm"
            >
              <CloseOutlined
                className={`absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-primary`}
                onClick={() => handleDelete(card.id)}
              />
              <div>
                <p className="font-semibold tracking-wide text-primary">
                  {card.authorization.card_type} **** **** ****{' '}
                  {card.authorization.last4}
                </p>
                <p className="text-sm text-gray-600">
                  Expires: {card.authorization.exp_month}/
                  {card.authorization.exp_year}
                </p>
                <p className="text-sm text-gray-600">
                  Bank: {card.authorization.bank}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-600">
          No payment methods available.
        </p>
      )}
    </div>
  );
}
