import Campaign from "@/app/ui/home/Campaign";
import { oswald } from "@/style/font";
import Hero from "@/app/ui/home/Hero";
import dynamic from "next/dynamic";

const BelowFold = dynamic(() => import("./components/BelowFold"), {
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
    ssr: false,
    loading: () => (
      <div
        className={`mb-8 mt-4 py-5 ${oswald.className} px-4 sm:px-6 md:px-8`}
      >
        <div className="ml-2 flex flex-col gap-1 sm:ml-4 md:ml-8">
          <div className="mb-2 h-8 w-48 animate-pulse bg-gray-200 sm:h-9"></div>
          <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:gap-4 md:gap-6">
            <div className="h-4 w-16 animate-pulse bg-gray-200 sm:w-20"></div>
            <div className="flex gap-4">
              <div className="h-6 w-16 animate-pulse bg-gray-200"></div>
              <div className="h-6 w-16 animate-pulse bg-gray-200"></div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto px-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex-shrink-0">
                <div className="aspect-square w-24 animate-pulse bg-gray-200 sm:w-32 md:w-40"></div>
                <div className="mt-2 h-4 w-20 animate-pulse bg-gray-200 sm:w-28 md:w-36"></div>
                <div className="mt-1 h-3 w-16 animate-pulse bg-gray-200 sm:w-24 md:w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
);

function LoadingSpinner() {
  return (
    <div className="flex min-h-20 w-full items-center justify-center">
      <div className="h-20 w-full animate-pulse bg-gray-300"></div>
    </div>
  );
}

export default function Home() {
  return (
    <div className={`${oswald.className} bg-gray-100`}>
      <Hero />
      <main>
        <SelectedCategories />
        <Campaign />
        <h2 className="p-6 pt-9 text-3xl">YOU MAY LIKE</h2>
        <div className="mb-10 min-h-20">
          <RecommendedProducts category="men" />
        </div>
      </main>
      <BelowFold />
    </div>
  );
}
