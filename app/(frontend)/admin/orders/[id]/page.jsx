import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";

const OrderDetails = dynamic(
  () => import("@/app/(frontend)/admin/ui/orders/order-content"),
  { ssr: false, loading: () => <LoadingSpinner className="min-h-screen" /> },
);

export default function OrderDetailsPage({ params }) {
  return <OrderDetails params={params} />;
}
