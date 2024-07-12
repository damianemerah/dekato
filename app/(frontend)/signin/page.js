"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import viewIcon from "@/public/assets/icons/view.svg";
import viewOff from "@/public/assets/icons/view-off.svg";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      router.push("/");
      toast.success("Sign in successful!");
    }
  };

  return (
    <div className="flex_center my-16 mx-auto max-w-2xl px-20 py-10 border border-gray-100 rounded-lg shadow-xl bg-white">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} className="flex flex-col mt-4 w-full gap-4">
        <div>
          <label className="block mb-2" htmlFor="firstname">
            Email:
          </label>
          <input
            type="email"
            value={email}
            id="firstname"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2.5 bg-gray-100 rounded-md w-full text-black outline-none"
          />
        </div>
        <div>
          <label className="block mb-2" htmlFor="firstname">
            Password:
          </label>
          <div className="flex justify-between items-center bg-gray-100 rounded-md">
            <input
              type={viewPassword ? "text" : "password"}
              value={password}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="p-2.5 bg-gray-100 rounded-md w-full text-black outline-none"
            />
            <Image
              className="pr-2.5 cursor-pointer"
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
          className="bg-slate-900 text-white py-2.5 px-16 rounded-md mx-auto mt-4"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
