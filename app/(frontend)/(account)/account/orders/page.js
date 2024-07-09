import React from "react";
import Link from "next/link";
import OrderCard from "@/app/ui/account/orders/OrderCard";
import AccountLayout from "../AccountLayout";
import CartCard from "@/app/ui/cart/CartCard";

export default function Orders() {
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/account", label: "My Account" },
    { href: "/account/orders", label: "Orders", active: true },
  ];

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

  return (
    <AccountLayout title="Orders" breadcrumbs={breadcrumbs}>
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
    </AccountLayout>
  );
}
