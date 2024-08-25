import AccountLayout from "../AccountLayout";
import { ButtonPrimary } from "@/app/ui/button";
import { oswald } from "@/style/font";

export default function Newsletter() {
  const breadcrumbs = [
    { href: "/", label: "Home" },
    { href: "/account", label: "My Account" },
    { href: "/account/newsletter", label: "Newsletter", active: true },
  ];
  return (
    <AccountLayout title="Address Book" breadcrumbs={breadcrumbs}>
      <div className="space-y-12">
        <div className="space-y-6">
          <h2 className={`${oswald.className} text-2xl`}>
            Subscription Options
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </div>
              <label htmlFor="newsletter">General Subscription</label>
            </div>
          </div>
        </div>
        <ButtonPrimary>Save</ButtonPrimary>
      </div>
    </AccountLayout>
  );
}
