import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const OrdersList = dynamic(
  () => import("@/app/(frontend)/admin/ui/orders/order-list"),
  { ssr: false, loading: () => <LoadingSpinner /> },
);

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function Page({ searchParams }) {
  return <OrdersList searchParams={searchParams} />;
}
