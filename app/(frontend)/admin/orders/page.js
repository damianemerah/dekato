import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";

const OrdersList = dynamic(
  () => import("@/app/(frontend)/admin/ui/orders/order-list"),
  { ssr: false, loading: () => <LoadingSpinner className="min-h-screen" />},
);

export default function Page({ searchParams }) {
  return <OrdersList searchParams={searchParams} />;
}
