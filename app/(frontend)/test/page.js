"use client";

import { useEffect, useState, useDeferredValue } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import viewIcon from "@/public/assets/icons/view.svg";
import viewOff from "@/public/assets/icons/view-off.svg";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createProduct, updateProduct } from "@/app/action/productAction";

export default function SignIn({ params, searchParams }) {
  const [viewPassword, setViewPassword] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      const productWithId = updateProduct.bind(
        null,
        "6694575fd8d0304a54134fa1",
      );

      const products = await productWithId(formData);

      console.log(products, "products🚀🚀🚀sssss");
    } catch (error) {
      toast.error("Error fetching products: " + error.message);
    }
  };

  return (
    <div className="flex_center mx-auto my-16 max-w-2xl rounded-lg border border-gray-100 bg-white px-20 py-10 shadow-xl">
      <h2>Sign in</h2>
      <form action={createProduct} className="mt-4 flex w-full flex-col gap-4">
        <div>
          <label className="mb-2 block" htmlFor="firstname">
            File:
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            multiple={true}
            className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
          />
          <input
            type="name"
            placeholder="Product Name"
            name="name"
            className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
          />
          <input
            type="text"
            placeholder="Description"
            name="description"
            className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
          />
          <input
            type="number"
            placeholder="price"
            name="price"
            className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
          />
          <input
            type="number"
            placeholder="quantity"
            name="quantity"
            className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block" htmlFor="firstname">
            Password:
          </label>
          <div className="flex items-center justify-between rounded-md bg-gray-100">
            <input
              type="text"
              name="image"
              className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
            />

            <Image
              className="cursor-pointer pr-2.5"
              src={viewPassword ? viewIcon : viewOff}
              width={30}
              height={30}
              alt="View password"
              onClick={() => setViewPassword(!viewPassword)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mx-auto mt-4 rounded-md bg-slate-900 px-16 py-2.5 text-white"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
