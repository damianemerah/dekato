"use client";

import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const CategoryList = dynamic(
  () => import("@/app/(frontend)/admin/ui/category/category-list"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  },
);

function LoadingSpinner() {
  return (
    <div className="flex min-h-40 w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function CategoryPage({ searchParams }) {
  return <CategoryList searchParams={searchParams} />;
}
