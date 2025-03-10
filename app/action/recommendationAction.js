'use server';

import { unstable_cache } from 'next/cache';
import { cookies } from 'next/headers';
import { auth } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongoConnection';
import Product from '@/models/product';
import Category from '@/models/category';
import UserActivity from '@/models/userActivity';
import { recommendationService } from '@/app/lib/recommendationService';

// Cache recommendations with a 5-minute TTL
export const getRecommendations = unstable_cache(
  async (type, categorySlug, productId, limit = 4) => {
    await dbConnect();
    const session = await auth();
    const userId = session?.user?.id;

    let products = [];

    if (productId && type === 'similar') {
      // Get similar products for a specific product
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const userActivity = userId
        ? await UserActivity.findOne({ userId }).select('naughtyList')
        : null;

      products = await product.findSimilarProducts(
        userActivity,
        Number.parseInt(limit, 10)
      );
    } else if (userId && type === 'personalized') {
      // Get personalized recommendations
      products = await recommendationService.getPersonalizedRecommendations(
        userId,
        Number.parseInt(limit, 10)
      );
    } else {
      // Fallback to category-based or general recommendations
      const filter = { status: 'active' };

      if (categorySlug) {
        const categoryDoc = await Category.findOne({
          slug: categorySlug,
        }).select('_id');
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        }
      }

      products = await Product.find(filter)
        .sort({ purchaseCount: -1, viewCount: -1, createdAt: -1 })
        .limit(Number.parseInt(limit, 10))
        .populate('category', 'name slug')
        .lean();
    }

    // Format the response data
    return products.map((product) => {
      const { _id, ...rest } = product;
      return {
        id: _id.toString(),
        ...rest,
        category: product.category?.map((cat) => ({
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
        })),
      };
    });
  },
  ['recommendations'],
  { revalidate: 300 } // 5 minutes
);

// Track product interaction (not cached, as it modifies data)
export async function trackProductInteraction(
  productId,
  interactionType = 'view'
) {
  await dbConnect();
  const session = await auth();

  if (!session?.user) {
    throw new Error('Authentication required');
  }

  if (!productId) {
    throw new Error('Product ID is required');
  }

  if (!['view', 'purchase', 'click'].includes(interactionType)) {
    throw new Error(
      "Invalid interaction type. Must be 'view', 'click' or 'purchase'"
    );
  }

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Track the interaction
  await recommendationService.trackProductInteraction(
    session.user.id,
    productId,
    interactionType
  );

  return { success: true };
}

// Add product to naughty list (not cached, as it modifies data)
export async function addToNaughtyList(productId) {
  await dbConnect();
  const session = await auth();

  if (!session?.user) {
    throw new Error('Authentication required');
  }

  if (!productId) {
    throw new Error('Product ID is required');
  }

  // Verify product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Add to naughty list
  await recommendationService.addToNaughtyList(session.user.id, productId);

  return { success: true };
}

// Get recommended products for the home page
export async function getHomeRecommendations() {
  // Get selected category from cookie
  const cookieStore = cookies();
  const selectedCategory =
    cookieStore.get('selected-category')?.value || 'women';

  // Get user session
  const session = await auth();
  const userId = session?.user?.id;

  // Determine recommendation type
  const type = userId ? 'personalized' : 'general';

  // Get recommendations
  return getRecommendations(type, selectedCategory);
}
