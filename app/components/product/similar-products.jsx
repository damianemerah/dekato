// app/components/product/SimilarProductsServer.jsx
import { getRecommendations } from '@/app/action/recommendationAction';
import RecommendedProductsClient from '@/app/components/recommended-products-client';

// This is a Server Component by default
export default async function SimilarProductsServer({
  productId,
  category,
  limit = 8,
}) {
  if (!productId) {
    return null; // Or handle error appropriately
  }

  // If no category is provided or it's empty, just use the similar products logic
  if (!category || category.length === 0) {
    const similarProducts = await getRecommendations(
      'similar',
      null,
      productId,
      limit
    );
    return <RecommendedProductsClient initialProducts={similarProducts} />;
  }

  // Use the category slug from the passed category data
  // Assuming category is an array of objects with slug property
  const categorySlug = category[0]?.slug;

  // Fetch similar products using both product ID and category
  const similarProducts = await getRecommendations(
    'similar',
    categorySlug,
    productId,
    limit
  );

  // Pass data to the client component responsible for display
  return (
    <RecommendedProductsClient
      initialProducts={similarProducts}
      name="Similar Products"
    />
  );
}
