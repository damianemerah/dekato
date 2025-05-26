'use client';

import { useState } from 'react';
import { SmallSpinner } from '@/app/components/spinner';
import { toast } from 'sonner';
import { ButtonPrimary } from '../button';

export default function CheckoutButton({
  userId,
  userEmail,
  checkoutData,
  deliveryMethod,
  selectedAddress,
  selectedPaymentMethodId,
  saveCard,
  isUpdatingPayment,
}) {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePayment = async () => {
    console.log('[DEBUG CheckoutButton] handlePayment called with:', {
      userId,
      deliveryMethod,
      selectedAddress,
      userEmail,
      checkoutData,
      saveCard,
      selectedPaymentMethodId,
    });
    if (isProcessingPayment || !userId) return;

    setIsProcessingPayment(true);

    const data = {
      userId: userId,
      shippingMethod: deliveryMethod,
      address: selectedAddress,
      email: userEmail,
      items: checkoutData?.items,
      amount: checkoutData?.totalPrice,
      saveCard,
      cardId: selectedPaymentMethodId,
    };

    try {
      if (data.items.length > 0) {
        const res = await fetch(`/api/checkout/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const response = await res.json();
        console.log(
          '[DEBUG CheckoutButton] Response from /api/checkout:',
          response
        );

        if (response.success) {
          window.location.href = response.data.payment.data.authorization_url;
        }
        if (!response.success) {
          throw new Error(response.message || 'Something went wrong');
        }
      }
    } catch (error) {
      toast.info(error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="mt-6">
      <ButtonPrimary
        className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-sm font-bold normal-case tracking-wide text-white transition-all duration-200 hover:bg-opacity-90 disabled:bg-primary/50"
        onClick={() => {
          console.log('Payment initialize');
          handlePayment();
        }}
        disabled={isProcessingPayment || isUpdatingPayment}
      >
        {isProcessingPayment ? (
          <div className="flex items-center justify-center gap-2">
            <SmallSpinner className="text-white" />
            <span>Processing...</span>
          </div>
        ) : (
          'Review & Pay'
        )}
      </ButtonPrimary>
    </div>
  );
}
