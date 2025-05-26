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
import { Eye, EyeOff } from 'lucide-react';

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
  const { update: updateSession, data: session } = useSession();

  const resetPasswordWithToken = forgotPassword.bind(null, token);
  const [state, formAction] = useFormState(resetPasswordWithToken, {
    success: false,
    message: null,
    errors: null,
  });

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
      toast.success('Password reset successful! Redirecting to sign in...');

      async function updateAndRedirect() {
        try {
          await updateSession({ passwordChanged: true }); // await here
          router.push('/signin');
        } catch (error) {
          console.error('Failed to update session', error);
          router.push('/signin'); // fallback redirect anyway
        }
      }

      updateAndRedirect();
    } else if (state.message && !state.success) {
      const errorPath =
        state.errors?.passwordConfirm?.[0] || state.errors?.password?.[0];
      toast.error(errorPath || state.message || 'Password reset failed.');
    }
  }, [state, router, updateSession]);

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
            icon={viewPassword ? EyeOff : Eye}
            onIconClick={() => setViewPassword(!viewPassword)}
          />
          <InputType
            name="passwordConfirm"
            label="Confirm Password"
            type={viewPassword ? 'text' : 'password'}
            required={true}
            icon={viewPassword ? EyeOff : Eye}
            onIconClick={() => setViewPassword(!viewPassword)}
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
