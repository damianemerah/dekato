"use client";

import { useState, useCallback } from "react";
import { ButtonPrimary } from "@/app/ui/button";
import { SmallSpinner } from "@/app/ui/spinner";
import { InputType } from "@/app/ui/inputType";
import { forgotPassword } from "@/app/action/userAction";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ResetPassword({ params: { token } }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { update: updateSession } = useSession();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleResetPassword = useCallback(
    async (formData) => {
      setIsUpdating(true);
      setError("");
      try {
        formData.set("token", token);
        const res = await forgotPassword(formData);

        if (res.success) {
          await updateSession({ passwordChanged: true });
          setSuccess(true);
          setTimeout(() => {
            router.push("/signin");
          }, 4000);
        }
      } catch (error) {
        setError(error.message || "Something went wrong. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    },
    [token, router, updateSession],
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-primary">
          Reset Password
        </h2>
        {error && (
          <p
            className="mb-4 rounded-md bg-red-50 p-4 text-center text-red-700"
            role="alert"
          >
            {error}
          </p>
        )}
        {success && (
          <p
            className="mb-4 rounded-md bg-green-50 p-4 text-center text-green-700"
            role="alert"
          >
            Password reset successful! Redirecting to login...
          </p>
        )}
        <form action={handleResetPassword} className="space-y-4">
          <InputType
            name="password"
            label="New Password"
            type="password"
            required={true}
          />
          <InputType
            name="passwordConfirm"
            label="Confirm Password"
            type="password"
            // required={true}
          />
          <ButtonPrimary
            type="submit"
            className="w-full bg-primary"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <SmallSpinner className="!text-white" />
            ) : (
              "Reset Password"
            )}
          </ButtonPrimary>
        </form>
      </div>
    </div>
  );
}
