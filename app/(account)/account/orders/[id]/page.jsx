import { auth } from '@/app/lib/auth';
import { getOrderById } from '@/app/action/orderAction';
import { notFound } from 'next/navigation';
import OrderDetailClient from '@/app/components/account/orders/order-detail';

export default async function OrderDetailPage({ params }) {
  const session = await auth();

  if (!session?.user) {
    return <div>Authentication Required.</div>;
  }

  const order = await getOrderById(params.id);
  console.log(order, '💎💎');

  if (
    !order ||
    order?.error ||
    (order?.user._id.toString() !== session.user.id &&
      session.user.role !== 'admin')
  ) {
    notFound();
  }

  return <OrderDetailClient orderData={order} />;
}
