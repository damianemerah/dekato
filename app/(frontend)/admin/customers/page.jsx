"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";

const CustomerList = dynamic(
  () => import("@/app/(frontend)/admin/ui/customer/customer-list"),
  {
    loading: () => <LoadingSpinner className="min-h-screen" />,
    ssr: false,
  },
);

export default function CustomerPage() {
  return <CustomerList />;
}
