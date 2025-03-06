'use client';

import RecommendedProducts from '@/app/components/recommended-products';
import { useCategoryStore } from '@/app/store/store';

export default function RecommendProduct() {
  const selectedCategory = useCategoryStore((state) => state.selectedCategory);
  return <RecommendedProducts category={selectedCategory} />;
}
