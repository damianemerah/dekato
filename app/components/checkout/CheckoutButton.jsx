'use client';

import { useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { SmallSpinner } from '@/app/components/spinner';
import { toast } from 'sonner';
import {
  createPendingOrder,
  verifyAndCompleteOrder,
} from '@/app/action/checkoutAction';

export default function CheckoutButton({
  userId,
  userEmail,
  checkoutData,
  deliveryMethod,
  selectedAddress,
  selectedPaymentMethodId,
  saveCard,
}) {
  const [isPreparing, setIsPreparing] = useState(false);
  const [paystackProps, setPaystackProps] = useState(null);

  const preparePayment = async () => {
    if (!userId || isPreparing) return;
    setIsPreparing(true);

    const orderInputData = {
      userId,
      shippingMethod: deliveryMethod,
      address: selectedAddress,
      items: checkoutData?.items?.map((item) => ({
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
        },
        quantity: item.quantity,
        price: item.currentPrice,
        image: item.image,
        option: item.option,
        variantId: item.variantId,
      })),
      amount: checkoutData?.totalPrice,
      email: userEmail,
      saveCard,
      cardId: selectedPaymentMethodId,
    };

    try {
      const orderResult = await createPendingOrder(orderInputData);

      if (!orderResult.success) {
        console.error(
          '[ERROR CheckoutButton] createPendingOrder failed:',
          orderResult.message
        );
        throw new Error(orderResult.message || 'Failed to prepare order.');
      }

      // Set up Paystack props
      const props = {
        email: orderResult.email,
        amount: Math.round(orderResult.amount * 100), // Amount in kobo
        reference: orderResult.reference,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        metadata: {
          order_id: orderResult.orderId,
          user_id: userId,
          custom_fields: [
            {
              display_name: 'Payment Type',
              variable_name: 'payment_type',
              value: 'order',
            },
          ],
        },
        text: 'Pay Now',
        onSuccess: async (reference) => {
          toast.success('Payment successful! Processing your order...');

          try {
            // Verify and complete the order
            // Note: This server action will redirect us to the success page
            // We don't need to manually navigate
            await verifyAndCompleteOrder(reference.reference);
            // The server action will handle the redirect, so we won't reach here
            // But just in case there's no redirect, show a fallback message
            toast.success('Payment confirmed! Please wait...');
          } catch (error) {
            // If we get a NEXT_REDIRECT error, that's expected - the server action is handling navigation
            if (error.message && error.message.includes('NEXT_REDIRECT')) {
              console.log('[DEBUG CheckoutButton] Server handling redirect');
              // Let the server handle it - don't do anything
            } else {
              toast.error(
                'An error occurred processing your order. Please contact support.'
              );
              setIsPreparing(false);
            }
          }
        },
        onClose: () => {
          toast.warning('Payment window closed.');
          setIsPreparing(false);
        },
      };

      setPaystackProps(props);
    } catch (error) {
      toast.error(error.message || 'Failed to prepare payment');
      setIsPreparing(false);
    }
  };

  // Rendering logic
  if (!paystackProps) {
    // Initial state - show "Review & Pay" button
    return (
      <button
        className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-sm font-bold normal-case tracking-wide text-white transition-all duration-200 hover:bg-opacity-90"
        onClick={preparePayment}
        disabled={isPreparing}
      >
        {isPreparing ? (
          <div className="flex items-center justify-center gap-2">
            <SmallSpinner />
            <span>Processing...</span>
          </div>
        ) : (
          'Review & Pay'
        )}
      </button>
    );
  } else {
    // After order preparation - show Paystack button
    return (
      <div className="w-full">
        <PaystackButton
          {...paystackProps}
          className="flex w-full items-center justify-center rounded-md bg-primary py-3 text-sm font-bold normal-case tracking-wide text-white transition-all duration-200 hover:bg-opacity-90"
        />
      </div>
    );
  }
}
