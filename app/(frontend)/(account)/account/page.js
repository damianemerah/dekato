import { ButtonSecondary } from "@/app/ui/Button";
import AccountLayout from "./AccountLayout";
import { oswald } from "@/style/font";

export default function Overview() {
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/account", label: "My Account", active: true },
  ];
  return (
    <AccountLayout title="My Dashboard" breadcrumbs={breadcrumbs}>
      <div className="space-y-12">
        <div className="space-y-6">
          <h2 className={`${oswald.className} text-2xl`}>
            Account Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3
                className={`${oswald.className} text-lg font-medium uppercase`}
              >
                Contact Information
              </h3>
              <div className="flex flex-col items-start justify-center gap-1.5 py-2">
                <p>John Doe</p>
                <p>example@gmail.com </p>
              </div>
              <div className="flex gap-4">
                <ButtonSecondary>Edit</ButtonSecondary>
                <ButtonSecondary>Change Password</ButtonSecondary>
              </div>
            </div>
            <div className="space-y-1">
              <h3
                className={`${oswald.className} text-lg font-medium uppercase`}
              >
                Newsletter
              </h3>
              <div className="flex flex-col items-start justify-center gap-1.5 py-2">
                <p>You are not subscribed to our newsletter.</p>
              </div>
              <ButtonSecondary>Edit Subscription</ButtonSecondary>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className={`${oswald.className} text-2xl`}>Address Book</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3
                className={`${oswald.className} text-lg font-medium uppercase`}
              >
                Shipping Address
              </h3>
              <div className="flex flex-col items-start justify-center gap-1.5 py-2">
                <p>Your default shipping address:</p>
                <p>John Doe</p>
                <p>1234 Main St</p>
                <p>Springfield, IL 62701</p>
                <p>+234 7066765698</p>
              </div>
              <ButtonSecondary>Edit Address</ButtonSecondary>
            </div>
            <div className="space-y-1">
              <h3
                className={`${oswald.className} text-lg font-medium uppercase`}
              >
                Billing Address
              </h3>
              <div className="flex flex-col items-start justify-center gap-1.5 py-2">
                <p>Your default shipping address:</p>
                <p>John Doe</p>
                <p>1234 Main St</p>
                <p>Springfield, IL 62701</p>
                <p>+234 7066765698</p>
              </div>
              <ButtonSecondary>Edit Address</ButtonSecondary>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
