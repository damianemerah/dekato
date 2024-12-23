"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";
import Link from "next/link";
import { InputType } from "@/app/ui/inputType";
import { ButtonPrimary } from "@/app/ui/button";
import GoogleIcon from "@/public/assets/icons/google.svg";
import ArrowRightIcon from "@/public/assets/icons/arrow_right.svg";
const ViewIcon = dynamic(() => import("@/public/assets/icons/view.svg"));
const ViewOff = dynamic(() => import("@/public/assets/icons/view-off.svg"));

function SignInContent({ searchParams }) {
  const [viewPassword, setViewPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isNewLogin, setIsNewLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl = searchParams?.callbackUrl || "/";

  useEffect(() => {
    if (session?.user?.passwordChanged) {
      alert("Your password has been changed. Please sign in again.");
    }
    if (status === "authenticated" && !isNewLogin) {
      router.push(callbackUrl);
    }
  }, [status, router, isNewLogin, callbackUrl, session]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const togglePasswordView = useCallback(() => {
    setViewPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (formData) => {
      if (status === "authenticated" && !isNewLogin) {
        router.push(callbackUrl);
        return;
      }
      setIsLoading(true);
      setError("");
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        setIsNewLogin(true);
        router.push(callbackUrl);
      }
      setIsLoading(false);
    },
    [router, status, isNewLogin, callbackUrl],
  );

  const handleContinueShopping = useCallback(() => {
    router.push("/");
  }, [router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );
  }

  return (
    <div className="flex_center mx-auto my-16 max-w-2xl border border-gray-100 bg-white px-8 py-10 shadow-shadowSm">
      <h2>Sign in</h2>
      {error && (
        <p
          className="mb-4 rounded-md bg-red-50 p-4 text-center text-red-700"
          role="alert"
        >
          {error}
        </p>
      )}
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

      <p className="flex__center mt-4 gap-4 text-center text-gray-500">
        <span className="h-px w-1/2 bg-gray-300"></span>
        <label className="text-nowrap">Or sign in with</label>
        <span className="h-px w-1/2 bg-gray-300"></span>
      </p>
      <div className="flex__center mt-4 gap-5">
        <GoogleIcon
          className="inline-block cursor-pointer text-4xl"
          onClick={() => signIn("google")}
        />
      </div>
      <Link
        href="/#selected-category"
        onClick={handleContinueShopping}
        className="mx-auto mt-5 flex w-full items-center justify-end gap-2 text-sm text-gray-500 hover:underline"
      >
        Continue Shopping
        <ArrowRightIcon className="w-4" />
      </Link>
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
