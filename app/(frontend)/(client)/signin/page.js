"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { message } from "antd";
import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const ViewIcon = dynamic(() => import("@/public/assets/icons/view.svg"));
const ViewOff = dynamic(() => import("@/public/assets/icons/view-off.svg"));

function SignInContent() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [viewPassword, setViewPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNewLogin, setIsNewLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (status === "authenticated" && !isNewLogin) {
      router.push(callbackUrl);
      message.info("You are already logged in.");
    }
  }, [status, router, isNewLogin, callbackUrl]);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  }, []);

  const togglePasswordView = useCallback(() => {
    setViewPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (status === "authenticated" && !isNewLogin) {
        message.info("You are already logged in.");
        router.push(callbackUrl);
        return;
      }
      setIsLoading(true);
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        message.error(result.error);
      } else {
        setIsNewLogin(true);
        router.push(callbackUrl);
        message.success("Sign in successful!");
      }
      setIsLoading(false);
    },
    [credentials, router, status, isNewLogin, callbackUrl],
  );

  if (status === "loading") {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <SmallSpinner />
      </div>
    );
  }

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
            value={credentials.email}
            id="email"
            onChange={handleChange}
            className="w-full rounded-md bg-gray-100 p-2.5 text-primary outline-none"
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
              value={credentials.password}
              id="password"
              onChange={handleChange}
              className="w-full rounded-md bg-gray-100 p-2.5 text-primary outline-none"
              required
            />
            {viewPassword ? (
              <ViewIcon
                className="mr-2 w-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <ViewOff
                className="mr-2 w-5 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="mx-auto mt-4 rounded-md bg-slate-900 px-16 py-2.5 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="min-h-[224px]">
              <SmallSpinner />
            </div>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<SmallSpinner />}>
      <SignInContent />
    </Suspense>
  );
}
