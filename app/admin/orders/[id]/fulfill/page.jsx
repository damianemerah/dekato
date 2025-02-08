import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const FullfillOrder = dynamic(
  () => import("@/app/admin/ui/orders/order-fulfill"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  },
);

function LoadingSpinner() {
  return (
    <div className="flex min-h-40 w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function CustomerPage({ params: { id } }) {
  return <FullfillOrder id={id} />;
}
