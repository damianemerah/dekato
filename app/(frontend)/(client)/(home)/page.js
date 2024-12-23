import Campaign from "@/app/ui/home/Campaign";
import { oswald } from "@/style/font";
import Hero from "@/app/ui/home/Hero";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/app/ui/spinner";
import RecommendedProductsSkeleton from "@/app/ui/recommended-products-skeleton";
const BelowFold = dynamic(() => import("@/app/ui/home/BelowFold"), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});

const RecommendProduct = dynamic(
  () => import("@/app/ui/home/recommend-product"),
  {
    loading: () => <RecommendedProductsSkeleton />,
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
    <div className="bg-gray-100 font-oswald">
      <Hero />
      <main>
        <SelectedCategories />
        <RecommendProduct />
      </main>
      <BelowFold />
    </div>
  );
}
