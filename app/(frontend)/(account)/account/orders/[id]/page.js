
import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const OrderDetail = dynamic(
  () => import("@/app/ui/account/orders/order-detail"),
  {
    ssr: false,
    loading: () => <SmallSpinner className="!text-primary" />,
  },
);

export default function OrderDetailPage({ params }) {
  return <OrderDetail params={params} />;
}
