import dynamic from 'next/dynamic';

const AddressCard = dynamic(
  () => import('@/app/components/account/address/AddressCard'),
  { ssr: false }
);

export default function AddressPage() {
  return <AddressCard />;
}
