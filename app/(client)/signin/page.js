'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SmallSpinner } from '@/app/components/spinner';
import Link from 'next/link';
import { InputType } from '@/app/components/inputType';
import { ButtonPrimary } from '@/app/components/button';
import GoogleIcon from '@/public/assets/icons/google.svg';
import ArrowRightIcon from '@/public/assets/icons/arrow_right.svg';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

// Define the action outside the component
async function handleSignInAction(previousState, formData) {
  try {
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false, // Handle redirect manually based on state
    });

    if (result?.error) {
      // Map common errors to user-friendly messages if needed
      let message = result.error;
      if (message === 'CredentialsSignin') {
        message = 'Invalid email or password.';
      }
      return { success: false, message: message };
    }

    if (!result?.error && result?.ok) {
      return { success: true, message: 'Sign in successful.' };
    }

    return { success: false, message: 'Sign in failed. Please try again.' };
  } catch (error) {
    console.error('Sign in action error:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <ButtonPrimary
      type="submit"
      className="mx-auto mt-4 w-full bg-slate-900"
      disabled={pending}
    >
      {pending ? <SmallSpinner className="!text-white" /> : 'Sign in'}
    </ButtonPrimary>
  );
}

function SignInContent({ searchParams }) {
  const [viewPassword, setViewPassword] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const callbackUrl = searchParams?.callbackUrl || '/';

  const [state, formAction] = useFormState(handleSignInAction, {
    success: false,
    message: null,
  });

  useEffect(() => {
    if (session?.user?.passwordChanged) {
      alert('Your password has been changed. Please sign in again.');
    }
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl, session]);

  useEffect(() => {
    if (state.success) {
      // Sign-in was successful via the form action
      router.push(callbackUrl);
    } else if (state.message && !state.success) {
      // Display error using toast
      toast.error(state.message);
    }
  }, [state, router, callbackUrl]);

  const togglePasswordView = useCallback(() => {
    setViewPassword((prev) => !prev);
  }, []);

  const handleContinueShopping = useCallback(() => {
    router.push('/');
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    );
  }

  return (
    <div className="flex_center shadow-shadowSm mx-auto my-16 max-w-2xl border border-gray-100 bg-white px-8 py-10">
      <h2>Sign in</h2>
      <form action={formAction} className="mt-4 flex w-full flex-col gap-4">
        <InputType name="email" label="Email" type="email" required={true} />
        <div className="relative">
          <InputType
            name="password"
            label="Password"
            type={viewPassword ? 'text' : 'password'}
            required={true}
          />
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordView}
          >
            {viewPassword ? (
              <EyeOff className="w-5" />
            ) : (
              <Eye className="w-5" />
            )}
          </div>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </Link>
        <SubmitButton />
      </form>

      <p className="flex__center mt-4 gap-4 text-center text-gray-500">
        <span className="h-px w-1/2 bg-gray-300"></span>
        <label className="text-nowrap">Or sign in with</label>
        <span className="h-px w-1/2 bg-gray-300"></span>
      </p>
      <div className="flex__center mt-4 gap-5">
        <GoogleIcon
          className="inline-block cursor-pointer text-4xl"
          onClick={() => signIn('google')}
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

export default function SignIn({ searchParams }) {
  return (
    <Suspense fallback={<SmallSpinner />}>
      <SignInContent searchParams={searchParams} />
    </Suspense>
  );
}
