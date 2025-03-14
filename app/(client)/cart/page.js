import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

const CartContents = dynamic(() => import("@/app/ui/cart/cart-contents"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function Cart() {
  return <CartContents />;
}
