// app/components/product/SimilarProductsServer.jsx
import {
  getRecommendations,
  getRecentlyViewedProducts,
} from '@/app/action/recommendationAction';
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
  let similarProducts;
  if (!category || category.length === 0) {
    similarProducts = await getRecommendations(
      'similar',
      null,
      productId,
      limit
    );
  } else {
    // Use the category slug from the passed category data
    // Assuming category is an array of objects with slug property
    const categorySlug = category[0]?.slug;

    // Fetch similar products using both product ID and category
    similarProducts = await getRecommendations(
      'similar',
      categorySlug,
      productId,
      limit
    );
  }

  // Fetch recently viewed products
  const recentlyViewed = await getRecentlyViewedProducts(
    limit + similarProducts.length
  );

  const similarIds = new Set(similarProducts.map((p) => p.id));

  const filteredRecentlyViewed = recentlyViewed
    .filter((p) => !similarIds.has(p.id) && p.id !== productId)
    .slice(0, limit);

  return (
    <>
      <RecommendedProductsClient
        initialProducts={similarProducts}
        name="Similar Products"
        showDelete={true}
      />
      {filteredRecentlyViewed.length > 0 && (
        <RecommendedProductsClient
          initialProducts={filteredRecentlyViewed}
          name="Recently Viewed"
          showDelete={true}
        />
      )}
    </>
  );
}
