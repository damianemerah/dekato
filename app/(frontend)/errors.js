"use client";
import { useEffect } from "react";
import { Button, message } from "antd";

export default function Error({ error, reset }) {
  useEffect(() => {
    message.error({
      content: `Error: ${error.message}`,
      duration: 5,
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="mb-4 text-2xl">Something went wrong</h2>
      <Button type="primary" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
