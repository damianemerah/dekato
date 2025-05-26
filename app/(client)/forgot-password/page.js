'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ButtonPrimary } from '@/app/components/button';
import { SmallSpinner } from '@/app/components/spinner';
import { InputType } from '@/app/components/inputType';
import { sendPasswordResetToken } from '@/app/action/userAction';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <ButtonPrimary
      type="submit"
      className="w-full bg-primary"
      disabled={pending}
    >
      {pending ? <SmallSpinner className="!text-white" /> : 'Send Reset Link'}
    </ButtonPrimary>
  );
}

export default function ForgotPassword() {
  const [state, formAction] = useFormState(sendPasswordResetToken, {
    success: false,
    message: null,
    errors: null,
  });

  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      toast.info('You are already logged in. Redirecting to the home...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  }, [router, session]);

  useEffect(() => {
    if (state.success) {
      toast.success('Please check your email for password reset instructions.');
    } else if (state.message && !state.success) {
      const errorMessage =
        state.errors?.email?.[0] ||
        state.message ||
        'Failed to send reset email.';
      toast.error(errorMessage);
    }
  }, [state]);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-8">
      <div className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-primary">
          Forgot Password
        </h2>
        <form action={formAction} className="space-y-4">
          <InputType name="email" label="Email" type="email" required={true} />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
