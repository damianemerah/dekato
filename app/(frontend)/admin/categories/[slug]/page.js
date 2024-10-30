import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const CategoryContent = dynamic(
  () => import("@/app/(frontend)/admin/ui/category/category-content"),
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

export default function CategoryPage({ params: { slug } }) {
  return <CategoryContent slug={slug} />;
}
