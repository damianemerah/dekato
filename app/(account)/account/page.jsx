import { auth } from "@/app/lib/auth";
import { getUser, getUserAddress } from "@/app/action/userAction";
import { getUserOrders } from "@/app/action/orderAction";
import AccountContent from "@/app/components/account/account-content";

export default async function AccountPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <div>Authentication Required.</div>;
  }

  // Fetch data concurrently
  const [userData, addressData, ordersData] = await Promise.all([
    getUser(userId),
    getUserAddress(userId),
    getUserOrders(userId),
  ]);

  const defaultAddress = addressData?.find((addr) => addr.isDefault);

  return (
    <AccountContent
      userData={userData}
      defaultAddress={defaultAddress}
      recentOrders={ordersData}
    />
  );
}
