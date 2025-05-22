'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { ButtonPrimary } from '@/app/components/button';
import { SmallSpinner } from '@/app/components/spinner';
import { InputType } from '@/app/components/inputType';
import { forgotPassword } from '@/app/action/userAction';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import ViewIcon from '@/public/assets/icons/view.svg';
import ViewOff from '@/public/assets/icons/view-off.svg';
import { useUserStore } from '@/app/store/store';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <ButtonPrimary
      type="submit"
      className="w-full bg-primary"
      disabled={pending}
    >
      {pending ? <SmallSpinner className="!text-white" /> : 'Reset Password'}
    </ButtonPrimary>
  );
}

export default function ResetPassword({ params: { token } }) {
  const [viewPassword, setViewPassword] = useState(false);
  const router = useRouter();
  const { update: updateSession } = useSession();

  const resetPasswordWithToken = forgotPassword.bind(null, token);
  const [state, formAction] = useFormState(resetPasswordWithToken, {
    success: false,
    message: null,
    errors: null,
  });
  const user = useUserStore((state) => state.user);

  //if user is logged in, redirect to home page
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    if (state.success) {
      toast.success('Password reset successful! Redirecting to sign in...');
      // Optional: updateSession({ passwordChanged: true });
      const timer = setTimeout(() => {
        router.push('/signin');
      }, 3000); // Redirect after 3 seconds
      return () => clearTimeout(timer); // Cleanup timer on unmount
    } else if (state.message && !state.success) {
      const errorPath =
        state.errors?.passwordConfirm?.[0] || state.errors?.password?.[0];
      toast.error(errorPath || state.message || 'Password reset failed.');
    }
  }, [state, router]); // Add updateSession to deps if used

  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-8">
      <div className="w-full max-w-md">
        <h2 className="mb-6 text-center text-2xl font-semibold text-primary">
          Reset Password
        </h2>
        <form action={formAction} className="space-y-4">
          <InputType
            name="password"
            label="New Password"
            type={viewPassword ? 'text' : 'password'}
            required={true}
            icon={viewPassword ? ViewIcon : ViewOff}
            onIconClick={() => setViewPassword(!viewPassword)}
          />
          <InputType
            name="passwordConfirm"
            label="Confirm Password"
            type={viewPassword ? 'text' : 'password'}
            required={true}
            icon={viewPassword ? ViewIcon : ViewOff}
            onIconClick={() => setViewPassword(!viewPassword)}
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
