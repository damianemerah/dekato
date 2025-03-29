import { auth } from '@/app/lib/auth';
import { getCheckoutData } from '@/app/action/checkoutAction';
import { getUserAddress } from '@/app/action/userAction';
import { getPaymentMethod } from '@/app/action/paymentAction';
import CheckoutClientLayout from './CheckoutClientLayout';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ButtonSecondary } from '@/app/components/button';

export default async function CheckoutPageServer() {
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  if (!userId) {
    redirect('/signin?callbackUrl=/checkout'); // Redirect if not logged in
  }

  // Fetch data concurrently - Consider adding error handling here
  const [checkoutResult, addressData, paymentMethods] = await Promise.all([
    getCheckoutData(userId).catch((e) => {
      console.error('Checkout data fetch failed:', e);
      return null;
    }),
    getUserAddress(userId).catch((e) => {
      console.error('Address fetch failed:', e);
      return [];
    }),
    getPaymentMethod(userId).catch((e) => {
      console.error('Payment methods fetch failed:', e);
      return [];
    }),
  ]);

  // Handle case where checkout data is essential and failed
  if (!checkoutResult) {
    return <div>Error loading checkout data. Please try again.</div>;
  }

  // Handle empty cart scenario server-side
  if (checkoutResult && !checkoutResult.itemCount) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6">
        <p className="text-xl text-gray-600">
          No product selected for checkout.
        </p>
        <Link href="/cart">
          <ButtonSecondary className="px-6 py-3">Back to Cart</ButtonSecondary>
        </Link>
      </div>
    );
  }

  // Pass initial data to the client component
  return (
    <CheckoutClientLayout
      initialCheckoutData={checkoutResult}
      initialAddressData={addressData || []}
      initialPaymentMethods={paymentMethods || []}
      userId={userId}
      userEmail={userEmail}
    />
  );
}
