import { auth } from '@/app/lib/auth';
import { getUser } from '@/app/action/userAction';
import AccountSettings from '@/app/components/account/settings/account-settings';

export const metadata = {
  title: 'Account Settings | Dekato',
  description: 'Manage your account settings and preferences',
};

export default async function SettingsPage() {
  // Get the current session
  const session = await auth();
  const userId = session?.user?.id;

  // Redirect to login if not authenticated
  if (!userId) {
    // This would be handled by middleware, but including it here for completeness
    return null;
  }

  // Fetch user data server-side
  const userData = await getUser(userId);

  // Pass data to client component
  return <AccountSettings initialUserData={userData} />;
}
