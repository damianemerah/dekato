import CheckoutProgress from "@/app/ui/checkout-progress";
import { getCheckoutData } from "@/app/action/checkoutAction";
import CheckoutContent from "@/app/ui/checkout/checkout-content";
import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { restrictTo } from "@/utils/checkPermission";
import { Suspense } from "react";
import { BigSpinner } from "@/app/ui/spinner";

const checkoutDataCache = async (userId) => {
  return await getCheckoutData(userId);
};

async function Checkout() {
  await restrictTo("user", "admin");
  const session = await getServerSession(OPTIONS);
  const userId = session?.user?.id;

  const checkoutData = await checkoutDataCache(userId);
  return <CheckoutContent initialData={checkoutData} />;
}

function LoadingSpinner() {
  return <BigSpinner />;
}

export default function CheckoutPage() {
  return (
    <div className="bg-grayBg p-8">
      <CheckoutProgress />
      <Suspense fallback={<LoadingSpinner />}>
        <Checkout />
      </Suspense>
    </div>
  );
}
