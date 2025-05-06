import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const Payment = dynamic(() => import("@/app/ui/account/payment/payment"), {
  ssr: false,
  loading: () => <SmallSpinner className="!text-primary" />,
});

export default function PaymentPage() {
  return <Payment />;
}
