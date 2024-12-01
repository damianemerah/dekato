import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NewsletterContent } from "@/app/ui/account/newsletter/newsletter-content";

export default async function NewsletterPage() {
  const session = await getServerSession(authOptions);
  const initialData = await fetch(
    `${process.env.NEXTAUTH_URL}/api/subscribe?email=${session?.user?.email}`,
    { next: { revalidate: 3600, tags: ["emailSubscription"] } }, //every 1 hour
  ).then((res) => res.json());


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Newsletter Preferences</h1>
      <NewsletterContent initialData={initialData} />
    </div>
  );
}
