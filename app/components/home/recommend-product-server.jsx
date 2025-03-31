import { cookies } from 'next/headers';
import { getRecommendations } from '@/app/action/recommendationAction';
import RecommendedProductsClient from '@/app/components/recommended-products-client';

export default async function RecommendProductServerWrapper({ productId }) {
  // Get the recommended products from the server
  const recommendedProducts = productId
    ? await getRecommendations('similar', null, productId, 4)
    : await getRecommendations('general');

  // Get selected category from cookie
  const cookieStore = cookies();
  const selectedCategory =
    cookieStore.get('selected-category')?.value || 'women';

  // Pass the server-fetched data to the client component
  return (
    <RecommendedProductsClient
      initialProducts={recommendedProducts}
      category={selectedCategory}
    />
  );
}
