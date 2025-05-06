import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const AccountContent = dynamic(
  () => import("@/app/ui/account/account-content"),
  {
    ssr: false,
    loading: () => <SmallSpinner className="!text-primary" />,
  },
);

export default function AccountPage() {
  return <AccountContent />;
}
