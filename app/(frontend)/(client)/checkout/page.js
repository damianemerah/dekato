import CheckoutProgress from "@/app/ui/checkout-progress";
import CheckoutContent from "@/app/ui/checkout/checkout-content";

export default function CheckoutPage() {
  return (
    <div className="bg-grayBg p-8">
      <CheckoutProgress />
      <CheckoutContent />
    </div>
  );
}
