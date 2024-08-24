import { ButtonPrimary, ButtonSecondary } from "@/app/ui/Button";
import AccountLayout from "@/app/(frontend)/(account)/account/AccountLayout";
import { oswald } from "@/style/font";

export default function Address() {
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/account", label: "My Account" },
    { href: "/account/address", label: "Address Book", active: true },
  ];
  return (
    <AccountLayout title="Address Book" breadcrumbs={breadcrumbs}>
      <div className="space-y-12">
        <div className="space-y-6">
          <h2 className={`${oswald.className} text-2xl`}>Default Addresses</h2>
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
        <div className="space-y-6">
          <h2 className={`${oswald.className} text-2xl`}>My Addresses</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
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
        <ButtonPrimary>Add New Address</ButtonPrimary>
      </div>
    </AccountLayout>
  );
}
