import Link from 'next/link';

export default async function PaymentSuccess({ searchParams }) {
  const { reference, status } = searchParams;

  if (!reference || !status) {
    return (
      <div className="flex__center h-screen -translate-y-8">
        <div className="bg-white px-24 py-16 text-center">
          <h2 className="mb-5">Invalid Order Reference</h2>
          <p className="mb-12">We couldn&apos;t find details for your order.</p>
          <Link href="/cart">
            <button className="bg-primary px-9 py-4 text-white">
              Return to cart
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Determine the content based on the status from searchParams
  return (
    <div className="flex__center h-screen -translate-y-8">
      <div className="bg-white px-24 py-16 text-center">
        <h2 className="mb-5">Thank you for your purchase!</h2>
        <p>Your order has been placed successfully.</p>
        {status === 'processing' && (
          <p className="my-2 text-amber-600">
            Your payment is being processed. Please check your email for
            updates.
          </p>
        )}
        {status === 'pending' && (
          <p className="my-2 text-amber-600">
            Your payment is being processed.
          </p>
        )}
        {status === 'success' && (
          <p className="my-2 text-green-600">
            Your payment has been confirmed!
          </p>
        )}
        <p className="mb-12">
          We&apos;ll email you an order confirmation with details and tracking
          info.
        </p>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Link href="/">
            <button className="bg-primary px-9 py-4 text-white">
              Continue shopping
            </button>
          </Link>
          <Link href="/account/orders">
            <button className="border border-primary bg-white px-9 py-4 text-primary">
              View your orders
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
