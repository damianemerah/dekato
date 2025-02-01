"use client";

import RecommendedProducts from "@/app/ui/recommended-products";
import { useCategoryStore } from "@/store/store";

export default function RecommendProduct() {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  return <RecommendedProducts category={selectedCategory} />;
}
