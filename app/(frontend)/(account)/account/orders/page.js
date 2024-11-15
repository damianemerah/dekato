// import OrderList from "@/app/ui/account/orders/OrderCard";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import Order from "@/models/order";
import dbConnect from "@/lib/mongoConnection";
import { unstable_cache } from "next/cache";
import { SmallSpinner } from "@/app/ui/spinner";
import dynamic from "next/dynamic";

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

  return <OrderList orders={orders} />;
}
