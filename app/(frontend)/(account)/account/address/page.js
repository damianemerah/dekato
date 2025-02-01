import dynamic from "next/dynamic";

const AddressCard = dynamic(
  () => import("@/app/ui/account/address/AddressCard"),
  { ssr: false },
);

export default function AddressPage() {
  return <AddressCard />;
}
