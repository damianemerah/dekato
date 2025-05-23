import { auth } from '@/app/lib/auth';
import { NewsletterContent } from '@/app/components/account/newsletter/newsletter-content';
import { getSubscriptionStatus } from '@/app/action/subscriptionAction';

export default async function NewsletterPage() {
  const session = await auth();
  const userEmail = session?.user?.email;

  let initialData = null;
  if (userEmail) {
    initialData = await getSubscriptionStatus(userEmail);
  } else {
    initialData = { success: false, message: 'User not authenticated' };
  }

  return (
    <div className="space-y-6">
      <h1 className="font-oswald text-xl font-medium uppercase text-gray-700">
        Newsletter Preferences
      </h1>
      <NewsletterContent initialData={initialData} />
    </div>
  );
}
