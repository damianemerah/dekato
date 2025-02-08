import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const OrderDetail = dynamic(
  () => import("@/app/ui/account/orders/order-detail"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center">
        <SmallSpinner className="!text-primary" />
      </div>
    ),
  },
);

export default function OrderDetailPage({ params }) {
  return <OrderDetail params={params} />;
}
