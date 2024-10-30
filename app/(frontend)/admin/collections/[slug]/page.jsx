"use client";

import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const CollectionContent = dynamic(
  () => import("@/app/(frontend)/admin/ui/collection/collection-content"),
  { ssr: false, loading: () => <LoadingSpinner /> },
);

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function Page({ searchParams, params: { slug } }) {
  return <CollectionContent slug={slug} searchParams={searchParams} />;
}
