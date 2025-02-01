import dynamic from "next/dynamic";
import { getDashboardData } from "@/app/action/userAction";
import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth";
import { OPTIONS } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const AdminContent = dynamic(
  () => import("@/app/(frontend)/admin/ui/admin-home/admin-content"),
  {
    ssr: false,
  },
);

// Cache the dashboard data for 1 minute
const getCachedDashboardData = unstable_cache(
  async (session) => {
    if (!session || session.user.role !== "admin") {
      return null;
    }
    return getDashboardData(session);
  },
  ["dashboard-data"],
  {
    revalidate: 60, // Cache for 1 minute
    tags: ["dashboard"], // Tag for manual revalidation
  },
);

const AdminDashboard = async () => {
  // Check session before accessing cached data
  const session = await getServerSession(OPTIONS);

  if (!session || session.user.role !== "admin") {
    redirect("/signin");
  }

  // Pre-fetch the data on the server
  const initialData = await getCachedDashboardData(session);

  return <AdminContent initialData={initialData} />;
};

export default AdminDashboard;
