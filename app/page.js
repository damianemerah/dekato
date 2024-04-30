"use client";
import { useSession } from "next-auth/react";
import { blacklist } from "validator";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    // console.log(session, "session🚀🚀🚀");
  }
  const payment = async () => {
    const res = await fetch(
      "http://localhost:3000/api/payment/65df2653bffed9d39a4e02cb",
      {
        method: "GET",
      }
    );
    const data = await res.json();
    console.log(data.data.data);
    window.location.href = data.data.data.authorization_url;
  };

  //update property/product

  const update = async () => {
    const form = new FormData();

    const data = {
      productId: "662eae4289440597e922d89f",
      name: "new product 1",
      image: ["new image", "cat.jpg"],
      // // parent: false,
      price: 350,
      quantity: 50,
      // discount: 0,
      description: "new description UPDATED",
      category: "662c8505f72ae9759f2f6aea",
      variant: [
        {
          _id: "662eae4289440597e922d8a0",
          size: "medium",
          quantity: 25,
        },
        { size: "big", quantity: 5, _id: "662eae4289440597e922d8a1" },
        { size: "small", quantity: 20, _id: "662eae4289440597e922d8a2" },
        { size: "lars", quantity: 5, _id: "662eae4289440597e922d8a3" },
        { size: "last", quantity: 52 },
      ],
    };

    // const data = {
    //   name: "men",
    //   image: ["new image", "cat.jpg"],
    //   description: "new description updated",
    // };
    form.append("data", JSON.stringify(data));
    form.append("parent", false);

    console.log(form.get("name"), "form🚀🚀🚀");
    // const res = await fetch(
    //   "http://localhost:3000/api/category",
    //   {
    const res = await fetch("http://localhost:3000/api/product", {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: form,
    });
    const result = await res.json();
    console.log(result);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Hello World!</p>
      <button
        onClick={payment}
        style={{ padding: "10px", background: "black", color: "white" }}
      >
        PAY
      </button>
      <button
        onClick={update}
        style={{ padding: "10px", background: "black", color: "white" }}
      >
        Update
      </button>
    </main>
  );
}
