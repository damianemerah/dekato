// import OrderList from "@/app/ui/account/orders/OrderCard";
// React and Next.js imports
import dynamic from "next/dynamic";
import Link from "next/link";
import { unstable_cache } from "next/cache";

// Auth imports
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";

// Database imports
import Order from "@/models/order";
import dbConnect from "@/lib/mongoConnection";

// UI Components
import { SmallSpinner } from "@/app/ui/spinner";
import { ButtonSecondary } from "@/app/ui/button";
import { ShoppingOutlined } from "@ant-design/icons";

const OrderList = dynamic(() => import("@/app/ui/account/orders/OrderCard"), {
  ssr: false,
  loading: () => <SmallSpinner className="!text-primary" />,
});

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
  ["orders"],
  { revalidate: 10 },
);

export default async function Orders() {
  const session = await getServerSession(OPTIONS);
  const userId = session?.user?.id;

  const orders = await getOrders(userId);

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
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

  return <OrderList orders={orders} />;
}
