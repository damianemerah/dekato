'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SmallSpinner } from '@/app/components/spinner';
import { getOrderStatus } from '@/app/action/orderAction';
import { verifyAndCompleteOrder } from '@/app/action/checkoutAction';
import { message } from 'antd';

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function PaymentSuccess({ searchParams }) {
  const { reference } = searchParams;
  const { data: session } = useSession();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Redirect if no user session or reference
    if (!session?.user?.id) return;
    if (!reference) {
      router.push('/');
      return;
    }

    async function checkOrderStatus() {
      try {
        console.log(
          `[DEBUG SuccessPage] Processing payment reference: ${reference}`
        );

        // First verify and complete the order
        const verifyResult = await verifyAndCompleteOrder(reference);
        console.log(`[DEBUG SuccessPage] Verification result:`, verifyResult);

        if (verifyResult.success) {
          console.log(`[DEBUG SuccessPage] Order verified successfully`);
          setOrderSuccess(true);
          message.success('Your order has been confirmed!');
        } else {
          // If verification through verifyAndCompleteOrder failed,
          // try getting the order status as a fallback
          console.log(
            `[DEBUG SuccessPage] Verification failed, checking order status`
          );
          const statusResult = await getOrderStatus(reference);

          if (
            statusResult.success &&
            ['success', 'pending', 'processing'].includes(statusResult.status)
          ) {
            console.log(
              `[DEBUG SuccessPage] Order exists with status: ${statusResult.status}`
            );
            setOrderSuccess(true);
          } else {
            console.error(
              '[ERROR SuccessPage] Payment verification failed:',
              statusResult.message
            );
            router.push('/checkout/failed?reason=verification');
          }
        }
      } catch (error) {
        console.error('[ERROR SuccessPage] Error processing order:', error);
        router.push('/checkout/failed?reason=error');
      } finally {
        setIsLoading(false);
      }
    }

    checkOrderStatus();
  }, [session, reference, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex__center h-screen -translate-y-8">
      <div className="bg-white px-24 py-16 text-center">
        <h2 className="mb-5">Thank you for your purchase!</h2>
        <p>Your order has been placed successfully.</p>
        <p className="mb-12">
          We&apos;ll email you an order confirmation with details and tracking
          info.
        </p>
        <Link href="/">
          <button className="bg-primary px-9 py-4 text-white">
            Continue shopping
          </button>
        </Link>
      </div>
    </div>
  );
}
