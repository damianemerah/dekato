import Campaign from "@/app/ui/home/Campaign";
import { oswald } from "@/style/font";
import Hero from "@/app/ui/home/Hero";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";

const BelowFold = dynamic(() => import("@/app/ui/home/BelowFold"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const RecommendedProducts = dynamic(
  () => import("@/app/ui/recommended-products"),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  },
);

const SelectedCategories = dynamic(
  () => import("@/app/ui/home/selected-categories"),
  {
    loading: () => <LoadingSpinner className="min-h-[400px]" />,
    ssr: false,
  },
);

export default function Home() {
  return (
    <div className={`${oswald.className} bg-gray-100`}>
      <Hero />
      <main>
        <SelectedCategories />
        <Campaign />
        <div className="mb-10 px-4">
          <h2 className="pb-1 pt-6 font-oswald font-bold">YOU MAY LIKE</h2>
          <RecommendedProducts category="men" />
        </div>
      </main>
      <BelowFold />
    </div>
  );
}
