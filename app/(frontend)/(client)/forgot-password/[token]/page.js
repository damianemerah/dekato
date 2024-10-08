"use client";

import { useState, useCallback } from "react";
import { ButtonPrimary } from "@/app/ui/button";
import { SmallSpinner } from "@/app/ui/spinner";
import { message } from "antd";
import { InputType } from "@/app/ui/inputType";
import { forgotPassword } from "@/app/action/userAction";

export default function ResetPassword({ params: { token } }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleResetPassword = useCallback(
    async (formData) => {
      setIsUpdating(true);
      try {
        // TODO: Implement password reset logic
        formData.set("token", token);

        const res = await forgotPassword(formData);

        message.success("Password reset successfully");
      } catch (error) {
        message.error("Failed to reset password");
      } finally {
        setIsUpdating(false);
      }
    },
    [token],
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-primary">
          Reset Password
        </h2>
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
            required={true}
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
