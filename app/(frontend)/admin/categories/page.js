import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";

const CategoryContent = dynamic(
  () => import("@/app/(frontend)/admin/ui/category/category-content"),
  {
    ssr: false,
    loading: () => <LoadingSpinner className="min-h-screen" />,
  },
);

export default function CategoriesPage({ searchParams }) {
  return <CategoryContent searchParams={searchParams} />;
}
