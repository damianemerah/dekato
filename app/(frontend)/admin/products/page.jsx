"use client";

import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

const ProductsList = dynamic(
  () => import("@/app/(frontend)/admin/ui/products/products-list"),
  { ssr: false, loading: () => <LoadingSpinner /> },
);

export default function Page({ searchParams }) {
  return <ProductsList searchParams={searchParams} />;
}
