'use client';
import { useEffect } from 'react';
import { message } from 'antd';
import { ButtonSecondary } from '@/app/components/button';

export default function Error({ error, reset }) {
  useEffect(() => {
    message.error({
      content: `Error: ${error.message}`,
      duration: 5,
    });
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h2 className="mb-4 text-2xl">Something went wrong</h2>
      <ButtonSecondary type="primary" onClick={() => reset()}>
        Try again
      </ButtonSecondary>
    </div>
  );
}
