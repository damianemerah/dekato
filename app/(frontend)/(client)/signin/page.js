"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { message } from "antd";
import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";
import Link from "next/link";
import { InputType } from "@/app/ui/inputType";
import { ButtonPrimary } from "@/app/ui/button";

const ViewIcon = dynamic(() => import("@/public/assets/icons/view.svg"));
const ViewOff = dynamic(() => import("@/public/assets/icons/view-off.svg"));

function SignInContent() {
  const [viewPassword, setViewPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNewLogin, setIsNewLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (session?.user?.passwordChanged) {
      alert("Your password has been changed. Please sign in again.");
    }
    if (status === "authenticated" && !isNewLogin) {
      router.push(callbackUrl);
      message.info("You are already logged in.");
    }
  }, [status, router, isNewLogin, callbackUrl, session]);

  const togglePasswordView = useCallback(() => {
    setViewPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (formData) => {
      if (status === "authenticated" && !isNewLogin) {
        message.info("You are already logged in.");
        router.push(callbackUrl);
        return;
      }
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
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
    [router, status, isNewLogin, callbackUrl],
  );

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );
  }

  return (
    <div className="flex_center mx-auto my-16 max-w-2xl border border-gray-100 bg-white px-20 py-10 shadow-shadowSm">
      <h2>Sign in</h2>
      <form action={handleSubmit} className="mt-4 flex w-full flex-col gap-4">
        <InputType name="email" label="Email" type="email" required={true} />
        <div className="relative">
          <InputType
            name="password"
            label="Password"
            type={viewPassword ? "text" : "password"}
            required={true}
          />
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordView}
          >
            {viewPassword ? (
              <ViewIcon className="w-5" />
            ) : (
              <ViewOff className="w-5" />
            )}
          </div>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </Link>
        <ButtonPrimary
          type="submit"
          className="mx-auto mt-4 w-full bg-slate-900"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <SmallSpinner className="!text-white" />
            </div>
          ) : (
            "Sign in"
          )}
        </ButtonPrimary>
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
