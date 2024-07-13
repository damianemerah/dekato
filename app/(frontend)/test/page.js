"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import viewIcon from "@/public/assets/icons/view.svg";
import viewOff from "@/public/assets/icons/view-off.svg";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createProduct } from "@/app/action/productAction";

export default function SignIn({ params, searchParams }) {
  console.log("Dynamic Route Params:💎💎💎", params);
  console.log("Search Params:", searchParams);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const test = await createProduct(formData);
    } catch (error) {
      toast.error("Error fetching products: " + error.message);
    }
    // e.preventDefault();
    // const result = await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });

    // if (result?.error) {
    //   toast.error(result.error);
    // } else {
    //   router.push("/");
    //   toast.success("Sign in successful!");
    // }
  };

  return (
    <div className="flex_center mx-auto my-16 max-w-2xl rounded-lg border border-gray-100 bg-white px-20 py-10 shadow-xl">
      <h2>Sign in</h2>
      <form action={handleSubmit} className="mt-4 flex w-full flex-col gap-4">
        <div>
          <label className="mb-2 block" htmlFor="firstname">
            Email:
          </label>
          <input
            type="file"
            // value={email}
            id="firstname"
            name="email"
            multiple={true}
            // onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block" htmlFor="firstname">
            Password:
          </label>
          <div className="flex items-center justify-between rounded-md bg-gray-100">
            <input
              type={viewPassword ? "text" : "password"}
              value={password}
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
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
