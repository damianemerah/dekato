// import OrderList from "@/app/ui/account/orders/OrderCard";
// React and Next.js imports
import Link from 'next/link';
import { unstable_cache } from 'next/cache';

// Auth imports
import { auth } from '@/app/lib/auth';

// Database imports
import Order from '@/models/order';
import dbConnect from '@/app/lib/mongoConnection';

// UI Components
import { ButtonSecondary } from '@/app/components/button';
import { ShoppingOutlined } from '@ant-design/icons';
import OrderListClient from '@/app/components/account/orders/OrderCard';

const getOrders = unstable_cache(
  async (userId) => {
    await dbConnect();
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    return orders.map((order) => {
      const { _id, userId: _, ...orderData } = order;
      return {
        id: _id.toString(),
        product: order.product.map(({ _id, ...product }) => {
          const { _id: productId, ...productData } = product;
          return {
            id: _id.toString(),
            ...productData,
          };
        }),
        ...orderData,
      };
    });
  },
  ['orders'],
  { revalidate: 10 }
);

export default async function OrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Authentication Required.</div>;
  }

  const orders = await getOrders(userId);

  if (!orders || orders.length === 0) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 py-8 text-center">
        <ShoppingOutlined className="mb-4 text-6xl !text-gray-400" />
        <h2 className={`mb-2 text-2xl font-semibold`}>No orders yet</h2>
        <p className="mb-4 text-gray-600">
          You haven&apos;t placed any orders yet. Start shopping to see your
          orders here!
        </p>
        <Link href="/">
          <ButtonSecondary className="border-2 border-primary bg-white font-oswald text-sm uppercase text-primary transition-colors duration-300 hover:bg-primary hover:text-white">
            Start Shopping
          </ButtonSecondary>
        </Link>
      </div>
    );
  }

  return <OrderListClient orders={orders} />;
}
