import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";
import { getAdminProduct } from "@/app/action/productAction";

const ProductsList = dynamic(
  () => import("@/app/(frontend)/admin/ui/products/products-list"),
  { ssr: false, loading: () => <LoadingSpinner className="min-h-screen" /> },
);

export default async function Page({ searchParams }) {
  const data = await getAdminProduct({ page: 1 });

  return <ProductsList searchParams={searchParams} data={data} />;
}
