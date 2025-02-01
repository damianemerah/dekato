"use client";

import { oswald } from "@/style/font";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import ProductCardSkeleton from "@/app/ui/products/product-card-skeleton";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ProductCard from "@/app/ui/products/product-card";
import { useRecommendMutateStore } from "@/store/store";

const fetcher = async (type, category, productId) => {
  const url = `/api/recommendations?type=${type}${
    category ? `&category=${category}` : ""
  }${productId ? `&productId=${productId}` : ""}`;
  return fetch(url).then((res) => res.json());
};

const RecommendedProducts = ({ category, productId }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [type, setType] = useState("");

  const { shouldMutate, setShouldMutate } = useRecommendMutateStore(
    (state) => ({
      shouldMutate: state.shouldMutate,
      setShouldMutate: state.setShouldMutate,
    }),
  );

  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/product/")) {
      setType("similar");
    } else if (userId && pathname === "/") {
      setType("personalized");
    } else {
      setType("general");
    }
  }, [userId, pathname]);

  useEffect(() => {
    if (shouldMutate) {
      mutate(["/api/recommendations", type, category, productId], async () => {
        const updatedData = await fetcher(type, category, productId); // Re-fetch data
        return updatedData;
      });
      setShouldMutate(false);
    }
  }, [category, productId, type, shouldMutate, setShouldMutate]);

  const { data, error, isLoading } = useSWR(
    type ? ["/api/recommendations", type, category, productId] : null,
    () => fetcher(type, category, productId),
  );

  if (error) return null;

  const products = data?.products?.map((p) => ({ id: p._id, ...p })) || [];

  // Return null if no products and not loading
  if (!isLoading && products.length === 0) return null;

  return (
    <div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <h2 className={`${oswald.className} mb-6 text-center md:text-left`}>
        YOU MAY ALSO LIKE
      </h2>
      <div className="grid grid-cols-2 gap-2 bg-white md:grid-cols-3 md:gap-3 lg:grid-cols-4">
        {isLoading
          ? // Show skeleton items while loading
            [...Array(4)].map((_, i) => (
              <div key={`skeleton-${i}`}>
                <ProductCardSkeleton />
              </div>
            ))
          : // Show actual products when loaded
            products.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} showDelete={true} />
              </div>
            ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
