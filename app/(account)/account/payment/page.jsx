import { auth } from '@/app/lib/auth';
import { getPaymentMethod } from '@/app/action/paymentAction';
import Payment from '@/app/components/account/payment/payment';

export default async function PaymentPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Authentication Required.</div>;
  }

  const paymentMethods = await getPaymentMethod(userId);

  return <Payment initialPaymentMethods={paymentMethods} />;
}
