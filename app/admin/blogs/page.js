import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";

const BlogList = dynamic(() => import("@/app/admin/ui/blog/blog-list"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <SmallSpinner className="!text-primary" />
    </div>
  );
}

export default function BlogsPage({ searchParams }) {
  return <BlogList searchParams={searchParams} />;
}
