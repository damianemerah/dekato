import { auth } from '@/app/lib/auth';
import { getUserAddress } from '@/app/action/userAction';
import AddressCard from '@/app/components/account/address/AddressCard';

export default async function AddressPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Authentication Required.</div>;
  }

  const addressData = await getUserAddress(userId);

  return <AddressCard initialAddressData={addressData || []} />;
}
