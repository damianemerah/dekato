import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";

const OrderDetails = dynamic(
  () => import("@/app/admin/ui/orders/order-content"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
        <LoadingSpinner className="!text-primary" />
      </div>
    ),
  },
);

export default function OrderDetailsPage({ params }) {
  return <OrderDetails params={params} />;
}
