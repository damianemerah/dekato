import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";

const ProductsList = dynamic(
  () => import("@/app/(frontend)/admin/ui/products/products-list"),
  { ssr: false, loading: () => <LoadingSpinner className="min-h-screen" /> },
);

export default function Page({ searchParams }) {
  return <ProductsList searchParams={searchParams} />;
}
