import OrderCard from "@/app/ui/account/orders/OrderCard";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import Order from "@/models/order";
import dbConnect from "@/lib/mongoConnection";
import { unstable_cache } from "next/cache";

async function getOrders(userId) {
  await dbConnect();
  const orders = await Order.find({ userId });

  console.log(orders, "orderss⭐⭐⭐", userId);

  return orders;
}

export default async function Orders() {
  const orders = [
    {
      status: "Processing",
      orderNumber: "#001349",
      total: "$30000",
      deliveryDate: "2nd Feb, 2023",
      items: [
        {
          image: "/assets/image3.png",
          name: "Angels malu zip jeans slim black used",
          color: "Black",
          size: "M",
          quantity: 1,
          price: "129,00 EUR",
        },
        {
          image: "/assets/image4.png",
          name: "Angels malu zip jeans slim black used",
          color: "Red",
          size: "M",
          quantity: 1,
          price: "129,00 EUR",
        },
      ],
    },
    {
      status: "Processing",
      orderNumber: "#001350",
      total: "$15000",
      deliveryDate: "5th Feb, 2023",
      items: [
        {
          image: "/assets/image7.png",
          name: "Angels malu zip jeans slim blue used",
          color: "Blue",
          size: "M",
          quantity: 1,
          price: "100,00 EUR",
        },
      ],
    },
  ];

  // const session = await getServerSession(OPTIONS);
  // const userId = session?.user?.id;

  // const orders = await unstable_cache(
  //   async () => await getOrders(userId),
  //   ["user-orders"],
  //   { revalidate: 10 }, // Revalidate every 30 seconds
  // )();

  return (
    <>
      {orders.map((order, index) => (
        <OrderCard
          key={index}
          status={order.status}
          orderNumber={order.orderNumber}
          total={order.total}
          deliveryDate={order.deliveryDate}
          items={order.items}
        />
      ))}
    </>
  );
}
