'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SmallSpinner } from '@/app/components/spinner';
import { getOrderStatus } from '@/app/action/orderAction';
import { toast } from 'sonner';

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
  const [orderDetails, setOrderDetails] = useState(null);
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
          `[DEBUG SuccessPage] Checking order status for reference: ${reference}`
        );

        // Get order status using the server action
        const statusResult = await getOrderStatus(reference);
        console.log(`[DEBUG SuccessPage] Order status result:`, statusResult);

        if (statusResult.success) {
          console.log(
            `[DEBUG SuccessPage] Order exists with status: ${statusResult.status}`
          );
          setOrderDetails(statusResult);

          if (
            ['success', 'pending', 'processing'].includes(statusResult.status)
          ) {
            toast.success('Your order has been received!');
          } else if (statusResult.status === 'failed') {
            toast.error(
              'There was an issue with your payment. Please contact support.'
            );
          }
        } else {
          console.error(
            '[ERROR SuccessPage] Order status check failed:',
            statusResult.message
          );
          router.push('/checkout/failed?reason=verification');
        }
      } catch (error) {
        console.error(
          '[ERROR SuccessPage] Error checking order status:',
          error
        );
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

  if (!orderDetails?.success) {
    return (
      <div className="flex__center h-screen -translate-y-8">
        <div className="bg-white px-24 py-16 text-center">
          <h2 className="mb-5">We couldn&apos;t find your order</h2>
          <p className="mb-12">
            There might have been an issue with your order processing.
          </p>
          <Link href="/cart">
            <button className="bg-primary px-9 py-4 text-white">
              Return to cart
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex__center h-screen -translate-y-8">
      <div className="bg-white px-24 py-16 text-center">
        <h2 className="mb-5">Thank you for your purchase!</h2>
        <p>Your order has been placed successfully.</p>
        {orderDetails?.status === 'pending' && (
          <p className="my-2 text-amber-600">
            Your payment is being processed.
          </p>
        )}
        {orderDetails?.status === 'success' && (
          <p className="my-2 text-green-600">
            Your payment has been confirmed!
          </p>
        )}
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
