import dynamic from "next/dynamic";
import { SmallSpinner } from "@/app/ui/spinner";
import { getBlog } from "@/app/action/blogAction";

const BlogForm = dynamic(() => import("@/app/admin/ui/blog/blog-form"), {
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

export default async function BlogPage({ params }) {
  const { id } = params;
  let blog = null;

  if (id !== "new") {
    blog = await getBlog(id);
  }

  return <BlogForm initialData={blog} />;
}
