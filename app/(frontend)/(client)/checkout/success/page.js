"use client";

import Link from "next/link";
import { checkOrderPayment } from "@/app/action/orderAction";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SmallSpinner } from "@/app/ui/spinner";

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function PaymentSuccess({ searchParams }) {
  const { reference } = searchParams;
  const { data: session } = useSession();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.id) return;
    if (!reference) router.push("/");
    async function verifyPayment() {
      if (session?.user?.id && reference) {
        try {
          const result = await checkOrderPayment(session.user.id, reference);
          console.log(result, 1222);
          if (result.success === true) {
            setOrderSuccess(true);
          } else {
            router.push("/");
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
          router.push("/");
        }
      }
    }

    verifyPayment();
  }, [session, reference, router]);

  if (!orderSuccess) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex__center h-screen -translate-y-8">
      <div className="bg-white px-24 py-16 text-center">
        <h2 className="mb-5">Thank you for your purchase!</h2>
        <p>Your order has been placed successfully.</p>
        <p className="mb-12">
          We&apos;ll email you an order confirmation with details and tracking
          info.
        </p>
        <Link href="/">
          <button className="bg-primary px-9 py-4 text-white">
            Continue shopping
          </button>
        </Link>
      </div>
    </div>
  );
}
