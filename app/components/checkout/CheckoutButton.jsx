'use client';

import { useState } from 'react';
import { PaystackButton } from 'react-paystack';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const preparePayment = async () => {
    if (!userId || isPreparing) return;
    console.log('[DEBUG CheckoutButton] preparePayment called');
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
      console.log('[DEBUG CheckoutButton] Calling createPendingOrder');
      const orderResult = await createPendingOrder(orderInputData);
      console.log(
        '[DEBUG CheckoutButton] createPendingOrder result:',
        JSON.stringify(orderResult)
      );

      if (!orderResult.success) {
        console.error(
          '[ERROR CheckoutButton] createPendingOrder failed:',
          orderResult.message
        );
        throw new Error(orderResult.message || 'Failed to prepare order.');
      }

      // Set up Paystack props
      console.log('[DEBUG CheckoutButton] Setting up Paystack props');
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
          console.log('[DEBUG CheckoutButton] Payment successful:', reference);
          toast.success('Payment successful! Processing your order...');

          try {
            // Verify and complete the order
            const result = await verifyAndCompleteOrder(reference.reference);
            console.log(
              '[DEBUG CheckoutButton] Order verification result:',
              result
            );

            if (result.success) {
              toast.success(
                'Order confirmed! Redirecting to confirmation page...'
              );
              // Use window.location for direct navigation
              window.location.href = `/checkout/success?reference=${reference.reference}`;
            } else {
              toast.error(
                result.message ||
                  'Payment verification failed. Please contact support.'
              );
              setIsPreparing(false);
            }
          } catch (error) {
            console.error(
              '[ERROR CheckoutButton] Order verification error:',
              error
            );
            toast.error(
              'An error occurred processing your order. Please contact support.'
            );
            setIsPreparing(false);
          }
        },
        onClose: () => {
          console.log('[DEBUG CheckoutButton] Payment window closed by user');
          toast.warning('Payment window closed.');
          setIsPreparing(false);
        },
      };

      setPaystackProps(props);
    } catch (error) {
      console.error(
        '[ERROR CheckoutButton] Payment preparation error:',
        error.message,
        error.stack
      );
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
