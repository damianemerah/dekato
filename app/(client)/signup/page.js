'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import GoogleIcon from '@/public/assets/icons/google.svg';
import { Eye, EyeOff } from 'lucide-react';
import { InputType } from '@/app/components/inputType';
import { signIn } from 'next-auth/react';
import { createUser } from '@/app/action/userAction';
import { toast } from 'sonner';
import { SmallSpinner } from '@/app/components/spinner';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mx-auto mt-4 bg-slate-900 px-16 py-2.5 text-white"
    >
      {pending ? <SmallSpinner className="!text-white" /> : 'Sign Up'}
    </button>
  );
}

const SignUp = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const router = useRouter();

  const initialState = { success: false, message: null, errors: null };
  const [state, formAction] = useFormState(createUser, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success('Check your email to complete your profile.', {
        duration: 10000,
      });
    } else if (state.message && !state.success) {
      // Attempt to display field-specific errors first, then general message
      const fieldErrors = state.errors
        ? Object.values(state.errors).flat().join('. ')
        : null;
      toast.error(
        fieldErrors ||
          state.message ||
          'Sign up failed. Please check your input.'
      );
    }
  }, [state, router]);

  return (
    <div className="flex_center mx-auto my-16 max-w-2xl border border-gray-300 bg-white px-20 py-10">
      <h2>Sign Up</h2>
      <form action={formAction} className="mt-4 flex w-full flex-col gap-3">
        <div className="item__center flex-1 shrink-0 grow-0 basis-1/2 gap-4">
          <InputType name="firstname" label="Firstname" required={true} />
          <InputType name="lastname" label="Lastname" required={true} />
        </div>

        <InputType name="email" label="Email" type="email" required={true} />

        <InputType
          name="password"
          label="Password"
          type={viewPassword ? 'text' : 'password'}
          required={true}
          icon={viewPassword ? EyeOff : Eye}
          onIconClick={() => setViewPassword(!viewPassword)}
        />

        <InputType
          name="passwordConfirm"
          label="Password Confirm"
          type={viewPassword ? 'text' : 'password'}
          required={true}
          icon={viewPassword ? EyeOff : Eye}
          onIconClick={() => setViewPassword(!viewPassword)}
        />

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
    </div>
  );
};

export default SignUp;
