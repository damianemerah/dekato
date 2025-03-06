'use client';

import { useState, useCallback } from 'react';
import { ButtonPrimary } from '@/app/components/button';
import { SmallSpinner } from '@/app/components/spinner';
import { InputType } from '@/app/components/inputType';
import { sendPasswordResetToken } from '@/app/action/userAction';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (formData) => {
    setIsLoading(true);
    setShowMessage(false);
    setError('');
    try {
      await sendPasswordResetToken(formData);
      setShowMessage(true);
    } catch (error) {
      console.error('Failed to send password reset token:', error);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center px-8">
      <div className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-primary">
          Forgot Password
        </h2>
        {showMessage && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-center text-green-700">
            Please check your email for password reset instructions
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-center text-red-700">
            {error}
          </div>
        )}
        <form action={handleSubmit} className="space-y-4">
          <InputType name="email" label="Email" type="email" required={true} />
          <ButtonPrimary
            type="submit"
            className="w-full bg-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <SmallSpinner className="!text-white" />
            ) : (
              'Send Reset Link'
            )}
          </ButtonPrimary>
        </form>
      </div>
    </div>
  );
}
