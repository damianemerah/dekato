import OrderList from "@/app/ui/account/orders/OrderCard";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import Order from "@/models/order";
import dbConnect from "@/lib/mongoConnection";
import { unstable_cache } from "next/cache";
import _ from "lodash";
import { SmallSpinner } from "@/app/ui/spinner";
import { Suspense } from "react";

const getOrders = unstable_cache(
  async (userId) => {
    await dbConnect();
    const orders = await Order.find({ userId })
      .populate("product", "name variant image currentPrice")
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    return orders.map((order) => ({
      id: order._id.toString(),
      product: order.product.map(({ _id, ...product }) => ({
        id: _id.toString(),
        ..._.omit(product, ["_id"]),
      })),

      ..._.omit(order, ["_id", "userId"]),
    }));
  },
  ["orders"],
  { revalidate: 10 },
);

export default async function Orders() {
  const session = await getServerSession(OPTIONS);
  const userId = session?.user?.id;

  const orders = await getOrders(userId);

  console.log(orders, "orders🚀🔥");

  return (
    <>
      <Suspense fallback={<SmallSpinner />}>
        <OrderList orders={orders} />
      </Suspense>
    </>
  );
}
