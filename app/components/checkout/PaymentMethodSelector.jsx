'use client';

import { useState, useTransition } from 'react';
import { CheckOutlined } from '@ant-design/icons';
import { SmallSpinner } from '@/app/components/spinner';
import {
  updatePaymentMethod,
  getPaymentMethod,
} from '@/app/action/paymentAction';

export default function PaymentMethodSelector({
  paymentMethods,
  selectedPaymentMethodId,
  onPaymentMethodSelect,
  userId,
  onPaymentMethodsUpdate,
}) {
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handlePaymentMethodSelect = (paymentMethodId) => {
    setIsUpdatingPayment(true);
    startTransition(async () => {
      try {
        await updatePaymentMethod(paymentMethodId, { isDefault: true });
        onPaymentMethodSelect(paymentMethodId);

        // Fetch updated payment methods and update parent state
        if (userId && onPaymentMethodsUpdate) {
          const updatedMethods = await getPaymentMethod(userId);
          onPaymentMethodsUpdate(updatedMethods);
        }
      } catch (error) {
        console.error('Error updating payment method:', error);
      } finally {
        setIsUpdatingPayment(false);
      }
    });
  };

  return (
    <div className="mt-4 text-sm">
      <h2 className="mb-6 text-lg font-medium text-primary">
        Choose payment method
      </h2>
      <div className="mx-auto max-w-[320px] space-y-4 text-sm">
        {paymentMethods?.map((method) => (
          <div
            key={method.id}
            className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 ${
              selectedPaymentMethodId === method.id
                ? 'border-primary'
                : 'border-gray-300'
            }`}
            onClick={() => handlePaymentMethodSelect(method.id)}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                  selectedPaymentMethodId === method.id
                    ? 'border-primary text-primary'
                    : 'border-gray-300 text-gray-300'
                }`}
              >
                {selectedPaymentMethodId === method.id &&
                  (isPending ? (
                    <SmallSpinner className="h-5 w-5" />
                  ) : (
                    <CheckOutlined className="text-primary" />
                  ))}
              </div>
              <div>
                <p className="font-medium">
                  {method.authorization.card_type}{' '}
                  {method.authorization.bank ?? ''}
                </p>
                <p className="text-xs text-gray-600">
                  •••• {method.authorization.last4}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div
          className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 ${
            !selectedPaymentMethodId ? 'border-primary' : 'border-gray-300'
          }`}
          onClick={() => onPaymentMethodSelect(null)}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                !selectedPaymentMethodId
                  ? 'border-primary text-primary'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {!selectedPaymentMethodId && (
                <CheckOutlined className="text-primary" />
              )}
            </div>
            <div>
              <p className="font-medium">Pay with new card</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
