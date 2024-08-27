"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import ViewIcon from "@/public/assets/icons/view.svg";
import ViewOff from "@/public/assets/icons/view-off.svg";
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
    <div className="flex_center mx-auto my-16 max-w-2xl rounded-lg border border-gray-100 bg-white px-20 py-10 shadow-xl">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-4">
        <div>
          <label className="mb-2 block" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-2 block" htmlFor="password">
            Password:
          </label>
          <div className="flex items-center justify-between rounded-md bg-gray-100">
            <input
              type={viewPassword ? "text" : "password"}
              value={password}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
              required
            />
            {viewPassword ? (
              <ViewIcon
                className="mr-2 w-5 cursor-pointer"
                onClick={() => setViewPassword(!viewPassword)}
              />
            ) : (
              <ViewOff
                className="mr-2 w-5 cursor-pointer"
                onClick={() => setViewPassword(!viewPassword)}
              />
            )}
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
