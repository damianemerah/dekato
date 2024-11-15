import { LoadingSpinner } from "@/app/ui/spinner";
import dynamic from "next/dynamic";

const CategoryForm = dynamic(
  () => import("@/app/(frontend)/admin/ui/category/category-form"),
  {
    ssr: false,
    loading: () => <LoadingSpinner className="min-h-screen" />,
  },
);

export default function CategoryPage({ params }) {
  return <CategoryForm slug={params.slug} />;
}
